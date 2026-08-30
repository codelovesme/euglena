//! `euglena add` / `remove` / `ls` — installs an organelle via `code
//! install` and keeps `manifest.json`'s alias declarations in sync with it,
//! so the two-place edit (fetch the bytes, declare the alias) can't drift
//! into the mismatch `codegen::organelle_link_target` otherwise has to
//! report at generate time.

use std::fs;
use std::path::{Path, PathBuf};
use std::process::{self, Command};

use crate::exec::find_code_binary_or_exit;
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
pub fn add(name: &str, alias: Option<&str>) {
    let root = project_root();
    let manifest_path = require_manifest(&root);
    let binary = find_code_binary_or_exit();

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

/// Drop the manifest alias, then `code remove` the module — but only if
/// nothing else in the manifest still references it by name.
pub fn remove(alias: &str) {
    let root = project_root();
    let manifest_path = require_manifest(&root);

    let module_name = match remove_organelle_alias(&manifest_path, alias) {
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
    println!("Removed organelle alias '{}' from manifest.json", alias);

    if module_name.is_empty() || manifest_still_references_module(&manifest_path, &module_name) {
        return;
    }

    let binary = find_code_binary_or_exit();
    let status = Command::new(&binary)
        .args(["remove", &module_name])
        .current_dir(&root)
        .status();
    match status {
        Ok(s) if s.success() => println!("Removed installed module '{}'", module_name),
        _ => eprintln!(
            "euglena: alias removed, but `code remove {}` failed — remove it manually if unused",
            module_name
        ),
    }
}

/// Every declared organelle, and whether it's actually installed —
/// the cheap answer to "why won't this link?".
pub fn ls() {
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
                    "MISSING — run `{} add {reference}`",
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

/// Removes the alias and returns the module name it pointed at (empty for a
/// value shape `module_name_of` can't parse), or `Ok(None)` if the alias
/// wasn't declared.
fn remove_organelle_alias(manifest_path: &Path, alias: &str) -> Result<Option<String>, String> {
    let mut json = read_manifest_json(manifest_path)?;
    let obj = json
        .as_object_mut()
        .ok_or("manifest.json is not a JSON object")?;
    let Some(organelles) = obj.get_mut("organelles").and_then(|v| v.as_object_mut()) else {
        return Ok(None);
    };
    let Some(removed) = organelles.remove(alias) else {
        return Ok(None);
    };
    let module_name = module_name_of(&removed);
    write_manifest_json(manifest_path, &json)?;
    Ok(Some(module_name))
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

fn manifest_still_references_module(manifest_path: &Path, module_name: &str) -> bool {
    let Ok(json) = read_manifest_json(manifest_path) else {
        return false;
    };
    let Some(organelles) = json.get("organelles").and_then(|v| v.as_object()) else {
        return false;
    };
    organelles
        .values()
        .any(|v| module_name_of(v) == module_name)
}
