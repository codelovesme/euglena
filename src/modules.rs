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

use crate::exec::{baseline_code_binary_or_exit, uninstall_code_binary_or_exit};
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

/// `code install <name>`, then declare `<alias>: <name>` in manifest.json.
pub fn install(name: &str, alias: Option<&str>) {
    let root = project_root();
    let manifest_path = require_manifest(&root);
    let binary = baseline_code_binary_or_exit();

    let status = Command::new(&binary)
        .args(["install", name])
        .current_dir(&root)
        .status()
        .unwrap_or_else(|e| {
            eprintln!("euglena: failed to run '{}': {}", binary, e);
            process::exit(1);
        });
    if !status.success() {
        process::exit(status.code().unwrap_or(1));
    }

    let alias = alias.unwrap_or(name);
    if let Err(e) = insert_organelle_alias(&manifest_path, alias, name) {
        eprintln!(
            "euglena: installed '{}', but failed to update manifest.json: {}",
            name, e
        );
        process::exit(1);
    }
    println!("Added organelle '{}' -> '{}' in manifest.json", alias, name);
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
    let binary = orphaned.then(uninstall_code_binary_or_exit);

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
