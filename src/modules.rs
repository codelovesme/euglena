//! `euglena install` / `uninstall` / `list` — installs an organelle via `code
//! install` and keeps `manifest.json`'s alias declarations in sync with it,
//! so the two-place edit (fetch the bytes, declare the alias) can't drift
//! into the mismatch `codegen::organelle_link_target` otherwise has to
//! report at generate time.
//!
//! The three words are `cdlvsm`'s and `code`'s, deliberately: one vocabulary
//! across the family beats three spellings of the same operation. What
//! differs is the *argument*, and it has to — `code uninstall` takes a module
//! name, `euglena uninstall` takes the alias the manifest is keyed by.

use std::fs;
use std::path::{Path, PathBuf};
use std::process::{self, Command};

use crate::exec::{baseline_code_binary_or_exit, web_install_code_binary_or_exit};
use crate::{invocation, lockfile, manifest};

fn project_root() -> PathBuf {
    std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
}

fn require_manifest(project_root: &Path) -> PathBuf {
    let manifest_path = project_root.join("manifest.json");
    if !manifest_path.is_file() {
        eprintln!(
            "euglena: no manifest.json in '{}' — run this from an euglena app",
            project_root.display()
        );
        process::exit(1);
    }
    manifest_path
}

/// `euglena install [name] [--as alias]`.
///
/// With a name: fetch that organelle and make sure the manifest declares it.
/// Without one: the manifest *is* the list — fetch everything it declares,
/// which is what a fresh checkout needs and the only way to get an app
/// running without reading its manifest by hand.
pub fn install(name: Option<&str>, alias: Option<&str>) {
    match name {
        Some(name) => install_one(name, alias),
        None => {
            if alias.is_some() {
                eprintln!(
                    "euglena: `--as` gives one organelle a name, so it needs one to name — \
                     drop it to install everything the manifest declares"
                );
                process::exit(1);
            }
            install_declared();
        }
    }
}

/// Everything `manifest.json` declares, fetched in one go.
///
/// Per *module*, not per alias: two aliases on one module are two organelles
/// to the app and one download. `mock-organelles` counts too — a module named
/// only there is still a module this app links, and leaving it out breaks the
/// next mock run at link time, which is where it is hardest to read.
///
/// One failure does not stop the rest. A checkout missing four organelles
/// should learn that in one run, not four.
fn install_declared() {
    let root = project_root();
    let manifest_path = require_manifest(&root);
    let json = match read_manifest_json(&manifest_path) {
        Ok(json) => json,
        Err(e) => {
            eprintln!("euglena: {}", e);
            process::exit(1);
        }
    };

    let modules = declared_modules(&json);
    if modules.is_empty() {
        println!("no organelles to install — manifest.json declares none by name");
        return;
    }

    let web = runs_in_a_browser(&manifest_path);
    let binary = code_binary_for(web);

    let mut failed = Vec::new();
    for module in &modules {
        println!("installing {module}...");
        if !run_code_install(&binary, &root, module, web) {
            failed.push(module.clone());
        }
    }

    if failed.is_empty() {
        println!("{} organelle(s) declared and installed", modules.len());
        return;
    }
    eprintln!(
        "euglena: could not install {} of {}: {}",
        failed.len(),
        modules.len(),
        failed.join(", ")
    );
    process::exit(1);
}

/// One organelle: fetch it, and make sure the manifest declares it.
///
/// What the manifest will say is settled *before* anything is fetched, so a
/// refusal never leaves bytes behind that nothing names.
fn install_one(name: &str, alias: Option<&str>) {
    let root = project_root();
    let manifest_path = require_manifest(&root);
    let json = match read_manifest_json(&manifest_path) {
        Ok(json) => json,
        Err(e) => {
            eprintln!("euglena: {}", e);
            process::exit(1);
        }
    };

    let declare: Option<String> = match alias {
        Some(alias) => match module_of_alias(&json, alias) {
            // An alias is a name in the app: every `emit ... to <alias>`
            // means it. Quietly pointing it at a different module would
            // change what all of them do.
            Some(existing) if existing != name => {
                eprintln!(
                    "euglena: '{alias}' already names organelle '{existing}' in manifest.json \
                     — pick another alias, or `{} uninstall {alias}` first",
                    invocation::command_prefix()
                );
                process::exit(1);
            }
            Some(_) => None,
            None => Some(alias.to_string()),
        },
        None => match aliases_of_module(&json, name).first() {
            // Already declared. A second entry would be a second organelle —
            // a module has state, so two names are two of them — and nobody
            // typing `install <name>` twice meant that. Saying `--as` does.
            Some(existing) => {
                println!("'{name}' is already declared as organelle '{existing}'");
                None
            }
            None => Some(name.to_string()),
        },
    };

    let web = runs_in_a_browser(&manifest_path);
    let binary = code_binary_for(web);
    if !run_code_install(&binary, &root, name, web) {
        process::exit(1);
    }

    let Some(alias) = declare else {
        return;
    };
    if let Err(e) = insert_organelle_alias(&manifest_path, &alias, name) {
        eprintln!(
            "euglena: installed '{}', but failed to update manifest.json: {}",
            name, e
        );
        process::exit(1);
    }
    println!("Added organelle '{}' -> '{}' in manifest.json", alias, name);
}

/// A web app gets the browser's archive rather than the machine's library,
/// and the flag that asks for it is newer than euglena's own baseline.
fn code_binary_for(web: bool) -> String {
    if web {
        web_install_code_binary_or_exit()
    } else {
        baseline_code_binary_or_exit()
    }
}

fn run_code_install(binary: &str, root: &Path, module: &str, web: bool) -> bool {
    let mut args = vec!["install", module];
    if web {
        args.extend(["--platform", "wasm32"]);
    }
    match Command::new(binary).args(&args).current_dir(root).status() {
        Ok(status) => status.success(),
        Err(e) => {
            eprintln!("euglena: failed to run '{}': {}", binary, e);
            false
        }
    }
}

/// Drop the manifest alias, then `code uninstall` the module — but only if
/// nothing else in the manifest still references it by name.
///
/// The whole plan is worked out before anything is written, the `code`
/// binary included. Resolving it later would mean a version refusal landing
/// *after* the alias was already gone, leaving the manifest edited and the
/// bytes still installed — and the version bar is a likely refusal, not a
/// remote one, since `code uninstall` only exists from 1.3.0.
pub fn uninstall(alias: &str) {
    let root = project_root();
    let manifest_path = require_manifest(&root);

    let mut json = match read_manifest_json(&manifest_path) {
        Ok(json) => json,
        Err(e) => {
            eprintln!("euglena: {}", e);
            process::exit(1);
        }
    };
    let module_name = match take_organelle_alias(&mut json, alias) {
        Ok(Some(name)) => name,
        Ok(None) => {
            eprintln!("euglena: no organelle aliased '{}' in manifest.json", alias);
            process::exit(1);
        }
        Err(e) => {
            eprintln!("euglena: {}", e);
            process::exit(1);
        }
    };

    // `json` no longer holds the alias, so this asks the question that
    // matters: with it gone, does anything still name the module?
    let orphaned = !module_name.is_empty() && !references_module(&json, &module_name);
    let binary = orphaned.then(baseline_code_binary_or_exit);

    if let Err(e) = write_manifest_json(&manifest_path, &json) {
        eprintln!("euglena: {}", e);
        process::exit(1);
    }
    println!("Removed organelle alias '{}' from manifest.json", alias);

    let Some(binary) = binary else {
        return;
    };
    let status = Command::new(&binary)
        .args(["uninstall", &module_name])
        .current_dir(&root)
        .status();
    match status {
        Ok(s) if s.success() => println!("Uninstalled module '{}'", module_name),
        _ => eprintln!(
            "euglena: alias removed, but `code uninstall {}` failed — uninstall it manually if unused",
            module_name
        ),
    }
}

/// Every declared organelle, and whether it's actually installed —
/// the cheap answer to "why won't this link?".
pub fn list() {
    let root = project_root();
    let manifest_path = require_manifest(&root);

    let app_manifest = match manifest::parse_manifest(&manifest_path) {
        Ok(m) => m,
        Err(e) => {
            eprintln!("euglena: {}", e);
            process::exit(1);
        }
    };

    if app_manifest.organelles.is_empty() {
        println!("no organelles declared in manifest.json");
        return;
    }

    for (alias, entry) in &app_manifest.organelles {
        let reference = entry.reference();
        let status = if is_literal_path(reference) {
            "literal path".to_string()
        } else {
            match lockfile::read(&root, reference) {
                Some(locked) => format!("installed @ {}", locked.version),
                None => format!(
                    "MISSING — run `{} install {reference}`",
                    invocation::command_prefix()
                ),
            }
        };
        println!("{alias:<16} -> {reference:<24} {status}");
    }
}

fn is_literal_path(reference: &str) -> bool {
    reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code")
}

/// Whether this app's manifest says it runs in a browser.
///
/// Read straight from the JSON rather than through `manifest::parse_manifest`,
/// which is about organelles and does not carry this. A manifest that says
/// nothing runs on a machine, which is what every app here said before there
/// was a second answer.
fn runs_in_a_browser(manifest_path: &Path) -> bool {
    read_manifest_json(manifest_path)
        .ok()
        .and_then(|json| {
            json.get("runtime")
                .and_then(|v| v.as_str())
                .map(|r| r == "web")
        })
        .unwrap_or(false)
}

fn read_manifest_json(manifest_path: &Path) -> Result<serde_json::Value, String> {
    let text = fs::read_to_string(manifest_path)
        .map_err(|e| format!("cannot read '{}': {e}", manifest_path.display()))?;
    serde_json::from_str(&text)
        .map_err(|e| format!("invalid JSON in '{}': {e}", manifest_path.display()))
}

fn write_manifest_json(manifest_path: &Path, json: &serde_json::Value) -> Result<(), String> {
    let rendered = serde_json::to_string_pretty(json)
        .map_err(|e| format!("failed to serialize manifest.json: {e}"))?;
    fs::write(manifest_path, rendered + "\n")
        .map_err(|e| format!("cannot write '{}': {e}", manifest_path.display()))
}

fn insert_organelle_alias(
    manifest_path: &Path,
    alias: &str,
    module_name: &str,
) -> Result<(), String> {
    let mut json = read_manifest_json(manifest_path)?;
    let obj = json
        .as_object_mut()
        .ok_or("manifest.json is not a JSON object")?;
    let organelles = obj
        .entry("organelles".to_string())
        .or_insert_with(|| serde_json::Value::Object(serde_json::Map::new()));
    let organelles_obj = organelles
        .as_object_mut()
        .ok_or("'organelles' is not a JSON object")?;
    organelles_obj.insert(
        alias.to_string(),
        serde_json::Value::String(module_name.to_string()),
    );
    write_manifest_json(manifest_path, &json)
}

/// Takes the alias out of an in-memory manifest and returns the module name
/// it pointed at (empty for a value shape `module_name_of` can't parse), or
/// `Ok(None)` if the alias wasn't declared.
///
/// In memory rather than on disk so the caller can decide what else is true
/// of the result — and whether it can go through with it — before writing.
fn take_organelle_alias(
    json: &mut serde_json::Value,
    alias: &str,
) -> Result<Option<String>, String> {
    let obj = json
        .as_object_mut()
        .ok_or("manifest.json is not a JSON object")?;
    let Some(organelles) = obj.get_mut("organelles").and_then(|v| v.as_object_mut()) else {
        return Ok(None);
    };
    let Some(removed) = organelles.remove(alias) else {
        return Ok(None);
    };
    Ok(Some(module_name_of(&removed)))
}

fn module_name_of(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(s) => s.clone(),
        serde_json::Value::Object(o) => o
            .get("module")
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string(),
        _ => String::new(),
    }
}

/// Every module the manifest names, once each, in a stable order.
///
/// Both blocks, for the reason `references_module` gives. Literal paths are
/// left out: a `link` that names a file has nothing to fetch, and asking a
/// release for `organelles/thing.so` would only produce a confusing 404.
fn declared_modules(json: &serde_json::Value) -> Vec<String> {
    let mut names: Vec<String> = Vec::new();
    for block in ["organelles", "mock-organelles"] {
        let Some(entries) = json.get(block).and_then(|v| v.as_object()) else {
            continue;
        };
        for value in entries.values() {
            let name = module_name_of(value);
            if name.is_empty() || is_literal_path(&name) || names.contains(&name) {
                continue;
            }
            names.push(name);
        }
    }
    names.sort();
    names
}

/// Which module an alias names, if the manifest declares that alias.
fn module_of_alias(json: &serde_json::Value, alias: &str) -> Option<String> {
    for block in ["organelles", "mock-organelles"] {
        if let Some(value) = json.get(block).and_then(|v| v.get(alias)) {
            let name = module_name_of(value);
            if !name.is_empty() {
                return Some(name);
            }
        }
    }
    None
}

/// Every alias already pointing at this module, in the order the manifest
/// lists them.
fn aliases_of_module(json: &serde_json::Value, module_name: &str) -> Vec<String> {
    let mut aliases = Vec::new();
    for block in ["organelles", "mock-organelles"] {
        let Some(entries) = json.get(block).and_then(|v| v.as_object()) else {
            continue;
        };
        for (alias, value) in entries {
            if module_name_of(value) == module_name && !aliases.contains(alias) {
                aliases.push(alias.clone());
            }
        }
    }
    aliases
}

/// Whether anything in the manifest still names this module.
///
/// Both blocks count. `mock-organelles` is overlaid onto `organelles` under
/// `EUGLENA_MOCK_MODE=true`, so a module referenced only there is still a
/// module this app links — uninstalling its bytes because the real block no
/// longer mentions it breaks the next mock run at link time.
fn references_module(json: &serde_json::Value, module_name: &str) -> bool {
    ["organelles", "mock-organelles"].iter().any(|block| {
        json.get(block)
            .and_then(|v| v.as_object())
            .is_some_and(|organelles| {
                organelles
                    .values()
                    .any(|v| module_name_of(v) == module_name)
            })
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// One directory per case, the convention the integration tests here use.
    fn manifest_with(tag: &str, runtime: Option<&str>) -> PathBuf {
        let dir =
            std::env::temp_dir().join(format!("euglena_modules_{}_{}", std::process::id(), tag));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).expect("create test directory");
        let path = dir.join("manifest.json");
        let body = match runtime {
            Some(r) => format!(r#"{{"name":"x","runtime":"{r}","organelles":{{}}}}"#),
            None => r#"{"name":"x","organelles":{}}"#.to_string(),
        };
        fs::write(&path, body).expect("write manifest");
        path
    }

    fn manifest(body: &str) -> serde_json::Value {
        serde_json::from_str(body).expect("test manifest parses")
    }

    /// `euglena install` with no name reads the manifest as its list. Per
    /// *module*, not per alias — two aliases on one module are two organelles
    /// to the app and one download — and `mock-organelles` counts, because a
    /// module named only there is still one this app links.
    #[test]
    fn the_manifest_is_the_list_of_what_to_install() {
        let json = manifest(
            r#"{
              "organelles": {
                "issuer": "jwt",
                "verifier": "jwt",
                "con": "console",
                "vendored": "organelles/local.so",
                "gene": "src/thing.code",
                "store": { "module": "mongodb", "config": { "url": "x" } }
              },
              "mock-organelles": {
                "store": { "module": "mongodb_mock" }
              }
            }"#,
        );
        assert_eq!(
            declared_modules(&json),
            vec!["console", "jwt", "mongodb", "mongodb_mock"],
            "one entry per module, mocks included, literal paths left out"
        );
    }

    #[test]
    fn a_manifest_declaring_nothing_asks_for_nothing() {
        assert!(declared_modules(&manifest(r#"{"name":"x"}"#)).is_empty());
        assert!(declared_modules(&manifest(r#"{"organelles":{}}"#)).is_empty());
    }

    /// The two questions `install <name>` asks before it writes: is this
    /// module already declared (then adding another entry would be adding a
    /// second organelle, which nobody meant), and is this alias already
    /// taken by something else (then repointing it would quietly change what
    /// every `emit ... to <alias>` does).
    #[test]
    fn the_manifest_answers_both_questions_install_asks() {
        let json = manifest(
            r#"{
              "organelles": {
                "issuer": "jwt",
                "verifier": "jwt",
                "con": "console"
              }
            }"#,
        );

        assert_eq!(aliases_of_module(&json, "jwt"), vec!["issuer", "verifier"]);
        assert!(aliases_of_module(&json, "strings").is_empty());

        assert_eq!(module_of_alias(&json, "con").as_deref(), Some("console"));
        assert_eq!(module_of_alias(&json, "nobody"), None);
    }

    /// Which bytes `euglena install` asks for comes from the manifest, not
    /// from the machine: a browser app cannot open a `.so`, so it gets the
    /// archive instead. A manifest that says nothing means a machine — what
    /// every app here said before there was a second answer.
    #[test]
    fn the_manifest_says_whether_the_bytes_are_for_a_browser() {
        assert!(runs_in_a_browser(&manifest_with("web", Some("web"))));
        assert!(!runs_in_a_browser(&manifest_with("native", Some("native"))));
        assert!(!runs_in_a_browser(&manifest_with("unsaid", None)));
        assert!(
            !runs_in_a_browser(Path::new("/nonexistent/manifest.json")),
            "an unreadable manifest is not a reason to fetch the wrong bytes"
        );
    }
}
