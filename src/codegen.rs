use std::fs;
use std::path::Path;

use crate::lockfile;
use crate::manifest::{parse_manifest, AppManifest, OrganelleEntry};
use crate::sha256;

/// Marks a `main.code` as ours. `write_main_code` refuses to overwrite any
/// file that doesn't start with this — a file the user wrote is not
/// euglena's to clobber.
pub const GENERATED_HEADER: &str =
    "| GENERATED — do not edit. Modify manifest.json or src/*.gene.code instead.";

/// Start of the *stamp* — the second line of every generated `main.code`,
/// recording which euglena wrote the file and the digest of everything below
/// it.
///
/// The header alone says "euglena owns this file"; it cannot say whether the
/// body is still the one euglena wrote. That distinction is the whole point:
/// a file that no longer hashes to its own stamp was **edited by hand**, and
/// the next `run`/`build`/`test` will silently throw those edits away. A
/// file that matches its stamp but no longer matches its inputs is merely
/// **stale**, and regenerating it is the fix rather than the loss.
const STAMP_PREFIX: &str = "| euglena ";

/// Separates the euglena version from the digest on the stamp line.
const STAMP_DIGEST_MARKER: &str = " · body sha256:";

/// What a generated `main.code`'s stamp line records.
pub struct Stamp {
    /// The euglena version that wrote the file.
    pub euglena_version: String,
    /// SHA-256 of the body — everything after the stamp line.
    pub body_sha256: String,
}

fn stamp_line(euglena_version: &str, body_sha256: &str) -> String {
    format!("{STAMP_PREFIX}{euglena_version}{STAMP_DIGEST_MARKER}{body_sha256}")
}

/// Read the stamp off a generated `main.code`.
///
/// `None` for a file that is not ours, or one written by a euglena old enough
/// to predate the stamp — both are handled the same way by callers: there is
/// nothing to verify against, so regenerate.
pub fn parse_stamp(text: &str) -> Option<Stamp> {
    let mut lines = text.lines();
    if lines.next()? != GENERATED_HEADER {
        return None;
    }
    let rest = lines.next()?.strip_prefix(STAMP_PREFIX)?;
    let (version, digest) = rest.split_once(STAMP_DIGEST_MARKER)?;
    if digest.len() != 64 || !digest.chars().all(|c| c.is_ascii_hexdigit()) {
        return None;
    }
    Some(Stamp {
        euglena_version: version.to_string(),
        body_sha256: digest.to_string(),
    })
}

/// The part of a generated `main.code` the stamp digests: everything after
/// the header and stamp lines. `None` if those two lines aren't there.
pub fn body_of(text: &str) -> Option<&str> {
    let after_header = text.strip_prefix(GENERATED_HEADER)?.strip_prefix('\n')?;
    let stamp_end = after_header.find('\n')?;
    Some(&after_header[stamp_end + 1..])
}

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
/// module name; it's checked against this project's `.code/lock.json` (the
/// file `code install` writes) to confirm it's installed, then linked as
/// `<name>.<ext>` — `link "terminal.so"`, not the platform-suffixed asset
/// `link "terminal-linux-x86_64.so"`. `code`'s loader maps the tidy spelling
/// back to the pinned asset through the same lockfile. `.wasm` is rejected up
/// front: `code`'s loader does not link `.wasm` organelles yet.
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
        Some(locked) => {
            let ext = Path::new(&locked.asset)
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("so");
            Ok(format!("{reference}.{ext}"))
        }
        None => Err(format!(
            "organelle '{reference}' is declared in manifest.json but not installed — run \
             `{} install {reference}`",
            crate::invocation::command_prefix()
        )),
    }
}

/// Generate the content of `main.code` from a manifest, a list of gene
/// filenames (as returned by `scan_genes`), and `project_root` (needed to
/// resolve module-name organelle references against `.code/lock.json`).
///
/// The result is the [`GENERATED_HEADER`], the stamp line (see
/// [`STAMP_PREFIX`]), a blank line, and then the body the stamp digests.
pub fn generate_main_code(
    manifest: &AppManifest,
    genes: &[String],
    project_root: &Path,
) -> Result<String, String> {
    let mut lines = Vec::new();

    // Organelle link statements — always aliased, always a quoted reference.
    //
    // Except a stand-in one (`"hosted": "membrane"`), which is not known until
    // the application runs and finds out whether it is being held. That one
    // links from inside a handler instead, and binds an *address* under the
    // same alias — which `emit` accepts, so the setup line below and every
    // gene reading the alias stay exactly as they were.
    let mut picks = Vec::new();
    for (alias, entry) in &manifest.organelles {
        let target = organelle_link_target(project_root, entry.reference())?;
        match entry.hosted() {
            None => lines.push(format!("link \"{}\" as {}", target, alias)),
            Some(stand_in) => {
                let held = organelle_link_target(project_root, stand_in)?;
                check_stand_in_agrees(project_root, alias, entry, stand_in)?;
                picks.push(format!(
                    "emit {PICK_PARTICLE} {{ alone = \"{target}\", held = \"{held}\" }} \
                     to this get _pick_{alias}\nlet {alias} = _pick_{alias}.organelle"
                ));
            }
        }
    }

    if !manifest.organelles.is_empty() && lines.iter().any(|l| l.starts_with("link ")) {
        lines.push(String::new());
    }

    if !picks.is_empty() {
        lines.push(pick_handler().to_string());
        lines.push(String::new());
        for pick in picks {
            lines.push(pick);
        }
        lines.push(String::new());
    }

    // Setup particles — for each organelle carrying a `config` block, emit
    // the particle its module declares as `setup` (`Config`, `Listen`, …)
    // with the block's fields. The result is captured so a gene can check it
    // (`_cfg_<alias> ∈ Exception`).
    //
    // Before the gene links, not after: a gene like `src/server.gene.code`
    // runs an unbounded keep-alive `loop` at link time, and anything emitted
    // after that link never runs. A stateful organelle configured from the
    // manifest has to be set up before that loop starts.
    let mut emitted_setup = false;
    for (alias, entry) in &manifest.organelles {
        let Some(fields) = entry.config() else {
            continue;
        };
        let setup = setup_particle(project_root, alias, entry)?;
        lines.push(generate_setup_line(&setup, alias, fields));
        emitted_setup = true;
    }

    if emitted_setup {
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

    // Boot particle.
    lines.push(format!(
        "emit EuglenaHasBeenBorn {{ cell_name = \"{}\" }} to this",
        manifest.name
    ));
    lines.push(String::new());

    // The body is *everything after the stamp line*, blank separator
    // included — exactly what `body_of` hands back, so the digest a file
    // carries and the digest recomputed from it can never disagree over
    // where the body starts.
    let body = format!("\n{}", lines.join("\n"));
    let stamp = stamp_line(env!("CARGO_PKG_VERSION"), &sha256::hex(body.as_bytes()));
    Ok(format!("{GENERATED_HEADER}\n{stamp}\n{body}"))
}

/// The particle euglena emits to configure `alias` from its `config` block.
///
/// A literal-path organelle must name it in the entry (`"setup": "Config"`),
/// since there is no lockfile row to read. A module name reads the `setup`
/// its `module.json` declared, recorded in `.code/lock.json` by `code
/// install`; a stateless module has none, and a `config` block on one is a
/// mistake worth stopping for.
/// The particle euglena emits to choose between an organelle and its hosted
/// stand-in. Named for the generated entry, which is the only place it exists;
/// a gene that defined a handler of this name would be answering euglena's
/// own question, so the name is deliberately one nobody would reach for.
const PICK_PARTICLE: &str = "EuglenaPickOrganelle";

/// The handler that does the choosing, generated once however many aliases
/// need it.
///
/// It has to be a handler rather than three top-level lines because `link`
/// takes a path it works out while running only inside a handler body — and
/// because the alias has to survive the choice, which it does by coming back
/// as an ordinary value the entry binds.
///
/// `Hosted` is answered by the runtime itself and is true from the first
/// statement, since a host installs itself before its guest runs at all.
fn pick_handler() -> String {
    format!(
        "{PICK_PARTICLE} {{ alone, held }} => {{\n    \
         emit Hosted to core get _where\n    \
         if _where.value {{\n        \
         link held as _held_organelle\n        \
         return EuglenaOrganellePicked {{ organelle = _held_organelle }}\n    \
         }}\n    \
         link alone as _alone_organelle\n    \
         return EuglenaOrganellePicked {{ organelle = _alone_organelle }}\n\
         }}"
    )
}

/// Both sides of a `hosted` pair have to answer the same setup particle,
/// because one `config` block is emitted for whichever gets linked and the
/// entry cannot know in advance which that will be.
///
/// Checked here rather than left to runtime: a mismatch would surface as a
/// configuration particle nobody handles, in whichever of the two lives the
/// application happened not to be tested in.
fn check_stand_in_agrees(
    project_root: &Path,
    alias: &str,
    entry: &OrganelleEntry,
    stand_in: &str,
) -> Result<(), String> {
    if entry.config().is_none() {
        return Ok(());
    }
    let theirs = match lockfile::read(project_root, stand_in).and_then(|m| m.setup) {
        Some(particle) => particle,
        None => return Ok(()),
    };
    let ours = setup_particle(project_root, alias, entry)?;
    if ours != theirs {
        return Err(format!(
            "organelle '{alias}' is configured with `{ours}` but its hosted stand-in \
             '{stand_in}' is configured with `{theirs}` — one `config` block is emitted for \
             whichever of the two gets linked, so both have to answer the same particle"
        ));
    }
    Ok(())
}

fn setup_particle(
    project_root: &Path,
    alias: &str,
    entry: &OrganelleEntry,
) -> Result<String, String> {
    if let Some(explicit) = entry.setup() {
        return Ok(explicit.to_string());
    }
    let reference = entry.reference();
    if reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code") {
        return Err(format!(
            "organelle '{alias}' is a literal path with a `config` block — name the particle \
             that configures it, e.g. \"setup\": \"Config\", in its manifest entry"
        ));
    }
    match lockfile::read(project_root, reference).and_then(|m| m.setup) {
        Some(particle) => Ok(particle),
        None => Err(format!(
            "organelle '{alias}' ({reference}) has a `config` block but its module is \
             stateless — it has no setup particle. Drop the `config` block; a stateless \
             module takes its parameters per call.\n(If '{reference}' *is* stateful, its \
             lockfile row predates `setup` — re-run `{} install {reference}`.)",
            crate::invocation::command_prefix()
        )),
    }
}

fn format_config_value(v: &serde_json::Value) -> String {
    match v {
        serde_json::Value::String(s) => {
            format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""))
        }
        serde_json::Value::Number(n) => n.to_string(),
        serde_json::Value::Bool(b) => b.to_string(),
        serde_json::Value::Array(arr) => {
            let items: Vec<String> = arr.iter().map(format_config_value).collect();
            format!("[{}]", items.join(", "))
        }
        serde_json::Value::Object(map) => {
            // Anonymous object literal: `{ k = v, ... }`.
            let parts: Vec<String> = map
                .iter()
                .map(|(k, v)| format!("{} = {}", k, format_config_value(v)))
                .collect();
            format!("{{ {} }}", parts.join(", "))
        }
        serde_json::Value::Null => "null".to_string(),
    }
}

/// `emit <Setup> { … } to <alias> get _cfg_<alias>` — the setup particle
/// (`Config`, `Listen`, …) is unqualified, since dispatch is per-recipient
/// (`to <alias>`), which already disambiguates.
fn generate_setup_line(
    setup: &str,
    target: &str,
    fields: &serde_json::Map<String, serde_json::Value>,
) -> String {
    if fields.is_empty() {
        format!("emit {setup} {{}} to {target} get _cfg_{target}")
    } else {
        let field_str: Vec<String> = fields
            .iter()
            .map(|(k, v)| format!("{} = {}", k, format_config_value(v)))
            .collect();
        format!(
            "emit {setup} {{ {} }} to {target} get _cfg_{target}",
            field_str.join(", "),
        )
    }
}

/// What `main.code` would be if it were generated right now — from whatever
/// `manifest.json`, `src/*.gene.code` and `.code/lock.json` say at this
/// moment, under this process's environment (`.env` interpolation and
/// `EUGLENA_MOCK_MODE` both feed generation).
pub fn regenerate(project_root: &Path) -> Result<String, String> {
    let manifest = parse_manifest(&project_root.join("manifest.json"))?;
    let genes = scan_genes(&project_root.join("src"));
    generate_main_code(&manifest, &genes, project_root)
}

/// Where a project's `main.code` stands relative to the inputs it came from.
///
/// The two states worth a user's attention are the two the
/// [`GENERATED_HEADER`] alone could never tell apart: `Stale`, which the next
/// `run`/`build`/`test` fixes by itself, and `Edited`, which the next
/// `run`/`build`/`test` destroys.
pub enum EntryStatus {
    /// No `main.code` yet — generated on the first `run`/`build`/`test`.
    Absent,
    /// Present but not ours: euglena refuses to regenerate over it.
    HandWritten,
    /// Ours, and byte-for-byte what the current inputs generate.
    UpToDate { euglena_version: String },
    /// Ours and unedited, but the inputs have moved on since it was written
    /// — or it predates the stamp, so there is nothing to verify it against.
    /// Regenerating is the fix, and every `run`/`build`/`test` does it.
    Stale,
    /// Ours by header, but the body no longer hashes to its own stamp:
    /// someone edited a generated file. Those edits die on the next
    /// `run`/`build`/`test`, so this is the one state worth failing on.
    Edited,
    /// Ours, but freshness is unknowable because regenerating fails — a
    /// missing organelle, an unparseable manifest. Carries that reason.
    Unverifiable(String),
}

/// Classify `<project_root>/main.code`. See [`EntryStatus`].
///
/// Note that generation reads the environment, so this answers the question
/// *for this process*: a `main.code` generated under `EUGLENA_MOCK_MODE=true`
/// is correctly reported `Stale` from a shell without it — the mock overlay
/// really did produce a different entry, and running without the variable
/// really will regenerate.
pub fn entry_status(project_root: &Path) -> EntryStatus {
    let Ok(text) = fs::read_to_string(project_root.join("main.code")) else {
        return EntryStatus::Absent;
    };
    if !text.starts_with(GENERATED_HEADER) {
        return EntryStatus::HandWritten;
    }

    // A hand-edit is checked before staleness: it's the destructive state,
    // and an edited file is usually stale as well, so reporting "stale"
    // first would bury the warning that matters.
    let (Some(stamp), Some(body)) = (parse_stamp(&text), body_of(&text)) else {
        // Our header, no readable stamp — written by a euglena that predates
        // it. Nothing to verify against; regenerating restores the stamp.
        return EntryStatus::Stale;
    };
    if sha256::hex(body.as_bytes()) != stamp.body_sha256 {
        return EntryStatus::Edited;
    }

    match regenerate(project_root) {
        Ok(fresh) if fresh == text => EntryStatus::UpToDate {
            euglena_version: stamp.euglena_version,
        },
        Ok(_) => EntryStatus::Stale,
        Err(e) => EntryStatus::Unverifiable(e),
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
pub fn write_main_code(project_root: &Path) -> Result<Generated, String> {
    let content = regenerate(project_root)?;

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
        .map_err(|e| format!("cannot write '{}': {}", entry_path.display(), e))?;

    Ok(Generated {
        genes: content
            .lines()
            .filter(|l| l.starts_with("link \"src/"))
            .count(),
        organelles: content
            .lines()
            .filter(|l| l.starts_with("link \"") && !l.starts_with("link \"src/"))
            .count(),
    })
}

/// What a generation produced, for `-v` to report. Counted off the emitted
/// links rather than off the manifest, so the number is what actually landed
/// in the file.
#[derive(Debug)]
pub struct Generated {
    pub genes: usize,
    pub organelles: usize,
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
        assert!(GENERATED_HEADER.starts_with("|"));
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
        // Linked by module name, not the platform-suffixed asset — code's
        // loader maps `terminal.so` back to the pinned asset via lock.json.
        assert!(content.contains("link \"terminal.so\" as term"));
    }

    #[test]
    fn generate_module_name_organelle_keeps_static_extension() {
        let root = tmp_root("module_name_static");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"crunch":{"name":"crunch","version":"0.2.0","asset":"crunch-linux-x86_64.a"}}}"#,
        )
        .unwrap();
        let m = make_manifest("myapp", &[("crunch", "crunch")]);
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"crunch.a\" as crunch"));
    }

    #[test]
    fn generate_module_name_organelle_not_installed_errors() {
        let root = tmp_root("module_missing");
        let m = make_manifest("myapp", &[("term", "terminal")]);
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("terminal"), "error should name it: {err}");
        assert!(err.contains("install"), "error should hint the fix: {err}");
    }

    #[test]
    fn generate_wasm_organelle_rejected() {
        let root = tmp_root("wasm_rejected");
        let m = make_manifest("myapp", &[("ui", "organelles/ui.wasm")]);
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("wasm"));
    }

    /// An organelle with a hosted stand-in is not linked up front: it is
    /// chosen while the application runs, and the alias every gene already
    /// writes is bound to whichever one it picked.
    #[test]
    fn generate_hosted_stand_in_is_picked_at_runtime() {
        let root = tmp_root("hosted_stand_in");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "net_server":{"name":"net_server","version":"1.0.0","asset":"net_server-linux-x86_64.so","setup":"Config"},
                "membrane":{"name":"membrane","version":"1.0.0","asset":"membrane-linux-x86_64.so","setup":"Config"}
            }}"#,
        )
        .unwrap();

        let mut map = BTreeMap::new();
        let mut config = serde_json::Map::new();
        config.insert("port".to_string(), serde_json::json!("8080"));
        map.insert(
            "net".to_string(),
            OrganelleEntry::Full {
                reference: "net_server".to_string(),
                config,
                setup: None,
                hosted: Some("membrane".to_string()),
            },
        );
        let m = AppManifest {
            name: "twolives".to_string(),
            organelles: map,
        };
        let content = generate_main_code(&m, &[], &root).unwrap();

        // Not linked up front — that is the whole point.
        assert!(
            !content.contains("link \"net_server.so\" as net"),
            "a stand-in organelle must not be linked before the choice:\n{content}"
        );
        assert!(content.contains("EuglenaPickOrganelle { alone, held } =>"));
        assert!(content.contains("emit Hosted to core get _where"));
        assert!(content.contains(
            "emit EuglenaPickOrganelle { alone = \"net_server.so\", held = \"membrane.so\" } \
             to this get _pick_net"
        ));
        assert!(content.contains("let net = _pick_net.organelle"));

        // And the alias is still the alias: one config block, emitted to the
        // name, whichever organelle ended up behind it.
        assert!(content.contains("emit Config { port = \"8080\" } to net get _cfg_net"));

        // The choice has to be made before anything is emitted to the name.
        let pick = content.find("let net = _pick_net.organelle").unwrap();
        let cfg = content.find("emit Config").unwrap();
        assert!(
            pick < cfg,
            "the organelle is configured before it exists:\n{content}"
        );
    }

    /// One `config` block is emitted for whichever organelle gets linked, so
    /// two that are configured differently cannot stand in for each other.
    #[test]
    fn generate_hosted_stand_in_must_take_the_same_setup() {
        let root = tmp_root("hosted_mismatch");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "net_server":{"name":"net_server","version":"1.0.0","asset":"net_server-linux-x86_64.so","setup":"Config"},
                "odd":{"name":"odd","version":"1.0.0","asset":"odd-linux-x86_64.so","setup":"Listen"}
            }}"#,
        )
        .unwrap();

        let mut map = BTreeMap::new();
        let mut config = serde_json::Map::new();
        config.insert("port".to_string(), serde_json::json!("8080"));
        map.insert(
            "net".to_string(),
            OrganelleEntry::Full {
                reference: "net_server".to_string(),
                config,
                setup: None,
                hosted: Some("odd".to_string()),
            },
        );
        let m = AppManifest {
            name: "mismatch".to_string(),
            organelles: map,
        };
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("Config") && err.contains("Listen"), "{err}");
        assert!(
            err.contains("odd"),
            "the error should name the stand-in: {err}"
        );
    }

    /// Ordinary organelles are untouched by any of this — no picker, no
    /// handler, nothing generated that was not generated before.
    #[test]
    fn generate_without_a_stand_in_generates_no_picker() {
        let m = make_manifest("plain", &[("term", "organelles/term.so")]);
        let root = tmp_root("no_picker");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/term.so\" as term"));
        assert!(!content.contains("EuglenaPickOrganelle"));
        assert!(!content.contains("Hosted"));
    }

    #[test]
    fn generate_header_marks_as_generated() {
        let m = make_manifest("x", &[]);
        let root = tmp_root("header");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.starts_with(GENERATED_HEADER));
    }

    #[test]
    fn generated_entry_is_stamped_with_its_own_body_digest() {
        let m = make_manifest("x", &[]);
        let root = tmp_root("stamp");
        let content = generate_main_code(&m, &[], &root).unwrap();

        let stamp = parse_stamp(&content).expect("a generated entry carries a stamp");
        assert_eq!(stamp.euglena_version, env!("CARGO_PKG_VERSION"));

        let body = body_of(&content).expect("a stamped entry has a body");
        assert_eq!(sha256::hex(body.as_bytes()), stamp.body_sha256);
        // The stamp digests the body, not itself: the code lives below it.
        assert!(body.contains("emit EuglenaHasBeenBorn"));
        assert!(!body.contains(STAMP_PREFIX));
    }

    #[test]
    fn stamp_sits_on_the_second_line_and_leaves_the_body_alone() {
        let m = make_manifest("x", &[("term", "organelles/term.so")]);
        let root = tmp_root("stamp_layout");
        let content = generate_main_code(&m, &[], &root).unwrap();
        let lines: Vec<&str> = content.lines().collect();
        assert_eq!(lines[0], GENERATED_HEADER);
        assert!(lines[1].starts_with(STAMP_PREFIX));
        assert_eq!(lines[2], "");
        assert_eq!(lines[3], "link \"organelles/term.so\" as term");
    }

    #[test]
    fn parse_stamp_rejects_what_is_not_one() {
        assert!(parse_stamp("| hand-written\nassert 1 = 1\n").is_none());
        // Our header but no stamp — an entry from a euglena that predates it.
        assert!(parse_stamp(&format!("{GENERATED_HEADER}\n\nassert 1 = 1\n")).is_none());
        // A stamp whose digest is not 64 hex characters is not a stamp.
        let short =
            format!("{GENERATED_HEADER}\n{STAMP_PREFIX}0.2.0{STAMP_DIGEST_MARKER}abc\n\nx\n");
        assert!(parse_stamp(&short).is_none());
    }

    /// The states `entry_status` exists to tell apart: a file the next
    /// run/build/test would harmlessly rewrite, versus one it would destroy.
    fn stamped_project(tag: &str) -> PathBuf {
        let root = tmp_root(tag);
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        write_main_code(&root).unwrap();
        root
    }

    #[test]
    fn entry_status_absent_and_hand_written() {
        let root = tmp_root("status_absent");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Absent));

        fs::write(root.join("main.code"), "| mine\nassert 1 = 1\n").unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::HandWritten));
    }

    #[test]
    fn entry_status_up_to_date_right_after_generation() {
        let root = stamped_project("status_fresh");
        match entry_status(&root) {
            EntryStatus::UpToDate { euglena_version } => {
                assert_eq!(euglena_version, env!("CARGO_PKG_VERSION"));
            }
            _ => panic!("a just-generated entry should be up to date"),
        }
    }

    #[test]
    fn entry_status_goes_stale_when_an_input_changes() {
        let root = stamped_project("status_stale");
        // Rename the cell: the entry still hashes to its own stamp, but it is
        // no longer what these inputs generate.
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"renamed","organelles":{}}"#,
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));

        // A new gene is an input too.
        write_main_code(&root).unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::UpToDate { .. }));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(
            root.join("src/extra.gene.code"),
            "export let gene_name = \"extra\"\n",
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));
    }

    #[test]
    fn entry_status_spots_a_hand_edit_to_a_generated_file() {
        let root = stamped_project("status_edited");
        let entry = root.join("main.code");
        let text = fs::read_to_string(&entry).unwrap();
        fs::write(&entry, format!("{text}assert 1 = 1\n")).unwrap();
        assert!(
            matches!(entry_status(&root), EntryStatus::Edited),
            "an edited body no longer matches its stamp"
        );
    }

    #[test]
    fn entry_status_treats_a_pre_stamp_entry_as_stale() {
        let root = tmp_root("status_prestamp");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        // What an older euglena wrote: our header, no stamp line.
        fs::write(
            root.join("main.code"),
            format!(
                "{GENERATED_HEADER}\n\nemit EuglenaHasBeenBorn {{ cell_name = \"x\" }} to this\n"
            ),
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));
    }

    #[test]
    fn entry_status_reports_why_it_cannot_verify() {
        let root = stamped_project("status_unverifiable");
        // Declare an organelle that was never installed: regeneration fails,
        // so freshness is unknowable rather than false.
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{"term":"terminal"}}"#,
        )
        .unwrap();
        match entry_status(&root) {
            EntryStatus::Unverifiable(e) => assert!(e.contains("terminal"), "got: {e}"),
            _ => panic!("a failing regeneration should be Unverifiable"),
        }
    }

    /// `{ module, config, setup }` as an `OrganelleEntry::Full`.
    fn full(reference: &str, config: serde_json::Value, setup: Option<&str>) -> OrganelleEntry {
        OrganelleEntry::Full {
            reference: reference.to_string(),
            config: config.as_object().cloned().unwrap_or_default(),
            setup: setup.map(str::to_string),
            hosted: None,
        }
    }

    fn one(name: &str, alias: &str, entry: OrganelleEntry) -> AppManifest {
        let mut map = BTreeMap::new();
        map.insert(alias.to_string(), entry);
        AppManifest {
            name: name.to_string(),
            organelles: map,
        }
    }

    #[test]
    fn generate_config_block_emits_the_modules_setup_particle() {
        let root = tmp_root("cfg_setup");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"jwt":{"name":"jwt","version":"1.1.4","asset":"jwt-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "auth",
            full("jwt", serde_json::json!({ "secret": "sh" }), None),
        );
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"jwt.so\" as auth"));
        assert!(content.contains("emit Config { secret = \"sh\" } to auth get _cfg_auth"));
    }

    #[test]
    fn generate_config_block_uses_http_server_listen() {
        let root = tmp_root("cfg_listen");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"http_server":{"name":"http_server","version":"1.1.4","asset":"http_server-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "srv",
            full("http_server", serde_json::json!({ "port": 9800 }), None),
        );
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("emit Config { port = 9800 } to srv get _cfg_srv"));
    }

    #[test]
    fn generate_empty_config_block_still_emits_setup() {
        let root = tmp_root("cfg_empty");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"fs":{"name":"fs","version":"1.1.4","asset":"fs-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one("app", "files", full("fs", serde_json::json!({}), None));
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("emit Config {} to files get _cfg_files"));
    }

    #[test]
    fn generate_config_on_a_stateless_module_errors() {
        let root = tmp_root("cfg_stateless");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"crypto":{"name":"crypto","version":"1.1.4","asset":"crypto-linux-x86_64.so"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "c",
            full("crypto", serde_json::json!({ "cost": 12 }), None),
        );
        let err = generate_main_code(&m, &[], &root).unwrap_err();
        assert!(err.contains("stateless"), "should say why: {err}");
        assert!(err.contains("crypto"), "should name it: {err}");
    }

    #[test]
    fn generate_literal_path_config_needs_an_explicit_setup() {
        let root = tmp_root("cfg_literal");
        let no_setup = one(
            "app",
            "x",
            full("organelles/x.so", serde_json::json!({ "k": 1 }), None),
        );
        let err = generate_main_code(&no_setup, &[], &root).unwrap_err();
        assert!(
            err.contains("setup"),
            "should ask for a setup particle: {err}"
        );

        let with_setup = one(
            "app",
            "x",
            full(
                "organelles/x.so",
                serde_json::json!({ "k": 1 }),
                Some("Init"),
            ),
        );
        let content = generate_main_code(&with_setup, &[], &root).unwrap();
        assert!(content.contains("emit Init { k = 1 } to x get _cfg_x"));
    }

    #[test]
    fn generate_config_null_value() {
        let root = tmp_root("cfg_null");
        let m = one(
            "app",
            "auth",
            full(
                "organelles/auth.so",
                serde_json::json!({ "token": null }),
                Some("Config"),
            ),
        );
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("token = null"));
    }

    #[test]
    fn generate_reference_organelle_emits_no_setup() {
        let m = make_manifest("app", &[("logger", "organelles/console.so")]);
        let root = tmp_root("ref_no_setup");
        let content = generate_main_code(&m, &[], &root).unwrap();
        assert!(content.contains("link \"organelles/console.so\" as logger"));
        assert!(!content.contains("_cfg_"));
        assert!(!content.contains("emit Config"));
    }

    #[test]
    fn write_main_code_refuses_hand_written_file() {
        let root = tmp_root("refuse_overwrite");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        fs::write(root.join("main.code"), "| hand-written\nassert 1 = 1\n").unwrap();
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
