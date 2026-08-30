use std::fs;
use std::path::Path;

use crate::lockfile;
use crate::manifest::{parse_manifest, AppManifest};

/// Marks a `main.code` as ours. `write_main_code` refuses to overwrite any
/// file that doesn't start with this — a file the user wrote is not
/// euglena's to clobber.
pub const GENERATED_HEADER: &str =
    "-- GENERATED — do not edit. Modify manifest.json or src/*.gene.code instead.";

/// Scan `src_dir` for `*.gene.code` files and return their names sorted
/// alphabetically (e.g. `["data_fetcher.gene.code", "state_loader.gene.code"]`).
pub fn scan_genes(src_dir: &Path) -> Vec<String> {
    let mut genes: Vec<String> = Vec::new();

    let entries = match fs::read_dir(src_dir) {
        Ok(e) => e,
        Err(_) => return genes,
    };

    for entry in entries.flatten() {
        let name = entry.file_name();
        let name_str = name.to_string_lossy();
        if name_str.ends_with(".gene.code") && entry.path().is_file() {
            genes.push(name_str.to_string());
        }
    }

    genes.sort();
    genes
}

/// What an organelle's manifest reference resolves to on a `link` line.
///
/// A reference containing `/` or ending `.so`/`.code` is a literal path — a
/// vendored or locally-built organelle, used as written. Anything else is a
/// module name, resolved through this project's `.code/lock.json` (the file
/// `code install` writes) to the asset it actually laid down, since that
/// asset name is platform-suffixed (`terminal-linux-x86_64.so`) and cannot
/// be hardcoded in the manifest. `.wasm` is rejected up front: `code`'s
/// loader does not link `.wasm` organelles yet.
pub fn organelle_link_target(project_root: &Path, reference: &str) -> Result<String, String> {
    if reference.ends_with(".wasm") {
        return Err(format!(
            "organelle reference '{reference}' names a .wasm file — code does not support \
             linking .wasm organelles yet"
        ));
    }
    if reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code") {
        return Ok(reference.to_string());
    }
    match lockfile::read(project_root, reference) {
        Some(locked) => Ok(locked.asset),
        None => Err(format!(
            "organelle '{reference}' is declared in manifest.json but not installed — run \
             `{} add {reference}`",
            crate::invocation::command_prefix()
        )),
    }
}

/// Generate the content of `main.code` from a manifest, a list of gene
/// filenames (as returned by `scan_genes`), and `project_root` (needed to
/// resolve module-name organelle references against `.code/lock.json`).
pub fn generate_main_code(
    manifest: &AppManifest,
    genes: &[String],
    project_root: &Path,
) -> Result<String, String> {
    let mut lines = Vec::new();

    lines.push(GENERATED_HEADER.to_string());
    lines.push(String::new());

    // Organelle link statements — always aliased, always a quoted reference.
    for (alias, entry) in &manifest.organelles {
        let target = organelle_link_target(project_root, entry.reference())?;
        lines.push(format!("link \"{}\" as {}", target, alias));
    }

    if !manifest.organelles.is_empty() {
        lines.push(String::new());
    }

    // Gene link statements — quoted, relative to the project root the
    // generated entry now lives at.
    for gene in genes {
        lines.push(format!("link \"src/{gene}\""));
    }

    if !genes.is_empty() {
        lines.push(String::new());
    }

    // Sap particles — collected from Full organelle entries.
    // Each Sap now handles both configuration and readiness — the response
    // is captured so the gene can detect Alive / Exception.
    let mut has_sap = false;
    for (alias, entry) in &manifest.organelles {
        if let Some(fields) = entry.sap() {
            lines.push(generate_sap_line(alias, fields));
            has_sap = true;
        }
    }

    if has_sap {
        lines.push(String::new());
    }

    // Boot particle.
    lines.push(format!(
        "emit EuglenaHasBeenBorn {{ cell_name = \"{}\" }} to this",
        manifest.name
    ));
    lines.push(String::new());

    Ok(lines.join("\n"))
}

fn format_sap_value(v: &serde_json::Value) -> String {
    match v {
        serde_json::Value::String(s) => {
            format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""))
        }
        serde_json::Value::Number(n) => n.to_string(),
        serde_json::Value::Bool(b) => b.to_string(),
        serde_json::Value::Array(arr) => {
            let items: Vec<String> = arr.iter().map(format_sap_value).collect();
            format!("[{}]", items.join(", "))
        }
        serde_json::Value::Object(map) => {
            // Anonymous object literal: `{ k = v, ... }`.
            let parts: Vec<String> = map
                .iter()
                .map(|(k, v)| format!("{} = {}", k, format_sap_value(v)))
                .collect();
            format!("{{ {} }}", parts.join(", "))
        }
        serde_json::Value::Null => "null".to_string(),
    }
}

/// `Sap` is shared vocabulary across organelles (the same convention `code`
/// documents for `Log`/`Exception`), so the class is unqualified — dispatch
/// is per-recipient (`to <alias>`), which already disambiguates.
fn generate_sap_line(target: &str, fields: &serde_json::Map<String, serde_json::Value>) -> String {
    if fields.is_empty() {
        format!("emit Sap {{}} to {} get _sap_{}", target, target)
    } else {
        let field_str: Vec<String> = fields
            .iter()
            .map(|(k, v)| format!("{} = {}", k, format_sap_value(v)))
            .collect();
        format!(
            "emit Sap {{ {} }} to {} get _sap_{}",
            field_str.join(", "),
            target,
            target
        )
    }
}

/// Generate `<project_root>/main.code` from `manifest.json` and
/// `src/*.gene.code`, and write it there.
///
/// Refuses to overwrite a `main.code` that doesn't carry [`GENERATED_HEADER`]
/// — that's a file the user wrote, and clobbering it is not euglena's call.
/// The file is left in place afterward (gitignored by `euglena init`): a
/// readable artifact that plain `code run .` also executes is worth more
/// than a hidden one.
pub fn write_main_code(project_root: &Path) -> Result<(), String> {
    let manifest_path = project_root.join("manifest.json");
    let manifest = parse_manifest(&manifest_path)?;

    let src_dir = project_root.join("src");
    let genes = scan_genes(&src_dir);

    let content = generate_main_code(&manifest, &genes, project_root)?;

    let entry_path = project_root.join("main.code");
    if entry_path.is_file() {
        let existing = fs::read_to_string(&entry_path).unwrap_or_default();
        if !existing.starts_with(GENERATED_HEADER) {
            return Err(format!(
                "'{}' already exists and was not generated by euglena — refusing to overwrite. \
                 Remove or rename it if you want euglena to manage this project's entry.",
                entry_path.display()
            ));
        }
    }

    fs::write(&entry_path, &content)
        .map_err(|e| format!("cannot write '{}': {}", entry_path.display(), e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::manifest::{AppManifest, OrganelleEntry};
    use std::collections::BTreeMap;
    use std::path::PathBuf;

    fn make_manifest(name: &str, organelles: &[(&str, &str)]) -> AppManifest {
        let mut map = BTreeMap::new();
        for (alias, reference) in organelles {
            map.insert(
                alias.to_string(),
                OrganelleEntry::Reference(reference.to_string()),
            );
        }
        AppManifest {
            name: name.to_string(),
            organelles: map,
        }
    }

    fn tmp_root(tag: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!(
            "euglena_codegen_test_{}_{}",
            std::process::id(),
            tag
        ));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn generate_no_organelles_no_genes() {
        let m = make_manifest("my-app", &[]);
        let root = tmp_root("no_org_no_gene");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"my-app\" } to this"));
        assert!(!content.contains("link"));
        assert!(content.starts_with(GENERATED_HEADER));
        assert!(GENERATED_HEADER.starts_with("--"));
    }

    #[test]
    fn generate_literal_path_organelles_and_genes() {
        let m = make_manifest(
            "todo",
            &[
                ("react", "organelles/react.so"),
                ("storage", "organelles/storage.so"),
            ],
        );
        let genes = vec![
            "state_loader.gene.code".to_string(),
            "todo_actions.gene.code".to_string(),
        ];
        let root = tmp_root("literal_paths");
        let content = generate_main_code(&m, &genes, &root).unwrap();
        assert!(content.contains("link \"organelles/react.so\" as react"));
        assert!(content.contains("link \"organelles/storage.so\" as storage"));
        assert!(content.contains("link \"src/state_loader.gene.code\""));
        assert!(content.contains("link \"src/todo_actions.gene.code\""));
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"todo\" } to this"));
    }

    #[test]
    fn generate_module_name_organelle_resolves_via_lockfile() {
        let root = tmp_root("module_name");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"terminal":{"name":"terminal","version":"1.1.3","asset":"terminal-linux-x86_64.so"}}}"#,
        )
        .unwrap();
        let m = make_manifest("myapp", &[("term", "terminal")]);
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"terminal-linux-x86_64.so\" as term"));
    }

    #[test]
    fn generate_module_name_organelle_not_installed_errors() {
        let root = tmp_root("module_missing");
        let m = make_manifest("myapp", &[("term", "terminal")]);
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("terminal"), "error should name it: {err}");
        assert!(err.contains("add"), "error should hint the fix: {err}");
    }

    #[test]
    fn generate_wasm_organelle_rejected() {
        let root = tmp_root("wasm_rejected");
        let m = make_manifest("myapp", &[("ui", "organelles/ui.wasm")]);
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("wasm"));
    }

    #[test]
    fn generate_header_marks_as_generated() {
        let m = make_manifest("x", &[]);
        let root = tmp_root("header");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.starts_with(GENERATED_HEADER));
    }

    #[test]
    fn generate_full_organelle_with_sap() {
        let mut fields = serde_json::Map::new();
        fields.insert(
            "base_path".to_string(),
            serde_json::Value::String(".".to_string()),
        );
        let mut map = BTreeMap::new();
        map.insert(
            "fs".to_string(),
            OrganelleEntry::Full {
                reference: "organelles/fs.so".to_string(),
                sap: fields,
            },
        );
        let m = AppManifest {
            name: "myapp".to_string(),
            organelles: map,
        };
        let root = tmp_root("full_sap");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/fs.so\" as fs"));
        assert!(content.contains("emit Sap { base_path = \".\" } to fs"));
        assert!(!content.contains("fs.Sap"));
    }

    #[test]
    fn generate_full_organelle_empty_sap() {
        let mut map = BTreeMap::new();
        map.insert(
            "process".to_string(),
            OrganelleEntry::Full {
                reference: "organelles/process.so".to_string(),
                sap: serde_json::Map::new(),
            },
        );
        let m = AppManifest {
            name: "myapp".to_string(),
            organelles: map,
        };
        let root = tmp_root("empty_sap");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/process.so\" as process"));
        assert!(content.contains("emit Sap {} to process"));
    }

    #[test]
    fn generate_sap_null_value() {
        let mut fields = serde_json::Map::new();
        fields.insert("token".to_string(), serde_json::Value::Null);
        let mut map = BTreeMap::new();
        map.insert(
            "auth".to_string(),
            OrganelleEntry::Full {
                reference: "organelles/auth.so".to_string(),
                sap: fields,
            },
        );
        let m = AppManifest {
            name: "myapp".to_string(),
            organelles: map,
        };
        let root = tmp_root("null_sap");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("token = null"));
    }

    #[test]
    fn generate_mixed_reference_and_full() {
        let mut fields = serde_json::Map::new();
        fields.insert(
            "port".to_string(),
            serde_json::Value::Number(serde_json::Number::from(9800)),
        );
        let mut map = BTreeMap::new();
        map.insert(
            "logger".to_string(),
            OrganelleEntry::Reference("organelles/console.so".to_string()),
        );
        map.insert(
            "server".to_string(),
            OrganelleEntry::Full {
                reference: "organelles/server.so".to_string(),
                sap: fields,
            },
        );
        let m = AppManifest {
            name: "myapp".to_string(),
            organelles: map,
        };
        let root = tmp_root("mixed");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/console.so\" as logger"));
        assert!(content.contains("link \"organelles/server.so\" as server"));
        assert!(content.contains("emit Sap { port = 9800 } to server"));
        assert!(!content.contains("logger.Sap"));
    }

    #[test]
    fn generate_literal_path_organelle_no_sap_emitted() {
        let m = make_manifest("myapp", &[("logger", "organelles/console.so")]);
        let root = tmp_root("no_sap");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/console.so\" as logger"));
        assert!(!content.contains("Sap"));
    }

    #[test]
    fn write_main_code_refuses_hand_written_file() {
        let root = tmp_root("refuse_overwrite");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        fs::write(root.join("main.code"), "-- hand-written\nassert 1 = 1\n").unwrap();
        let err = write_main_code(&root).unwrap_err();
        assert!(err.contains("already exists"), "got: {err}");
    }

    #[test]
    fn write_main_code_overwrites_generated_file() {
        let root = tmp_root("overwrite_generated");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        fs::write(
            root.join("main.code"),
            format!("{GENERATED_HEADER}\nold content\n"),
        )
        .unwrap();
        write_main_code(&root).unwrap();
        let content = fs::read_to_string(root.join("main.code")).unwrap();
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"x\" } to this"));
        assert!(!content.contains("old content"));
    }
}
