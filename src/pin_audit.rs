//! Pin diagnostics read declarations, never dotenv or mock-overlay state.
use serde_json::Value;
use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

fn read(path: &Path) -> Result<Value, String> {
    let text = fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
    let value: Value =
        serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?;
    if !value.is_object() {
        return Err(format!("{} must be an object", path.display()));
    }
    Ok(value)
}
fn lock(root: &Path) -> Result<Value, String> {
    let path = root.join(".code/lock.json");
    if !path.exists() {
        return Ok(serde_json::json!({}));
    }
    let value = read(&path)?;
    for section in ["modules", "genes"] {
        if let Some(entries) = value.get(section) {
            let entries = entries
                .as_object()
                .ok_or_else(|| format!("{}: {section} must be an object", path.display()))?;
            if entries.values().any(|v| !v.is_object()) {
                return Err(format!("{}: invalid {section} pin", path.display()));
            }
        }
    }
    Ok(value)
}
fn literal(name: &str) -> bool {
    name.contains('/')
        || [".so", ".a", ".code", ".wasm"]
            .iter()
            .any(|ext| name.ends_with(ext))
}
fn modules(manifest: &Value) -> BTreeSet<String> {
    let mut names = BTreeSet::new();
    for section in ["organelles", "mock-organelles"] {
        if let Some(entries) = manifest.get(section).and_then(Value::as_object) {
            for entry in entries.values() {
                for reference in [
                    entry
                        .as_str()
                        .or_else(|| entry.get("module").and_then(Value::as_str)),
                    entry.get("hosted").and_then(Value::as_str),
                ]
                .into_iter()
                .flatten()
                {
                    if !literal(reference) {
                        names.insert(reference.to_string());
                    }
                }
            }
        }
    }
    names
}
fn version(pin: &Value) -> Option<(u32, u32, u32)> {
    let raw = pin.get("version")?.as_str()?.trim_start_matches('v');
    let parts = raw
        .split('.')
        .map(str::parse::<u32>)
        .collect::<Result<Vec<_>, _>>()
        .ok()?;
    if parts.len() == 3 {
        Some((parts[0], parts[1], parts[2]))
    } else {
        None
    }
}

pub fn warnings(root: &Path, extra_guests: &[PathBuf]) -> Result<Vec<String>, String> {
    if !root.join("manifest.json").exists() {
        return Ok(Vec::new());
    }
    let manifest = read(&root.join("manifest.json"))?;
    let pins = lock(root)?;
    let declared = modules(&manifest);
    let genes: BTreeSet<_> = crate::genes::declared(&manifest).into_iter().collect();
    let mut warnings = Vec::new();
    for (section, names) in [("modules", &declared), ("genes", &genes)] {
        if let Some(entries) = pins.get(section).and_then(Value::as_object) {
            for name in entries.keys() {
                if !names.contains(name) {
                    warnings.push(format!("stale {section} pin '{name}' is not declared by manifest.json; review it before removing it"));
                }
            }
        }
    }
    let mut guests = BTreeSet::new();
    if let Some(entries) = manifest.get("guests").and_then(Value::as_array) {
        guests.extend(
            entries
                .iter()
                .filter_map(Value::as_str)
                .map(|p| root.join(p)),
        );
    }
    guests.extend(extra_guests.iter().cloned());
    for guest in guests {
        let description = read(&guest.join("manifest.json"))?;
        let guest_pins = lock(&guest)?;
        let name = description
            .get("name")
            .and_then(Value::as_str)
            .unwrap_or("<unnamed>");
        for module in modules(&description) {
            let host_pin = &pins["modules"][&module];
            let guest_pin = &guest_pins["modules"][&module];
            if let (Some(host), Some(child)) = (version(host_pin), version(guest_pin)) {
                if child > host {
                    warnings.push(format!("guest '{name}' module '{module}' pin {} is newer than shell {}; version ordering alone does not establish compatibility", guest_pin["version"].as_str().unwrap(), host_pin["version"].as_str().unwrap()));
                }
            }
        }
    }
    Ok(warnings)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    #[test]
    fn audits_real_mock_hosted_and_gene_references_and_numeric_versions() {
        let root = std::env::temp_dir().join(format!("euglena-pin-audit-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::create_dir_all(root.join("guest/.code")).unwrap();
        fs::write(root.join("manifest.json"), json!({"name":"shell","guests":["guest"],"genes":["palette"],"organelles":{"clock":"timer","net":{"module":"net_server","hosted":"membrane"}},"mock-organelles":{"net":"mock"}}).to_string()).unwrap();
        fs::write(root.join(".code/lock.json"), json!({"modules":{"timer":{"version":"2.9.0"},"mock":{},"membrane":{},"net_server":{},"unused":{}},"genes":{"palette":{},"old":{}}}).to_string()).unwrap();
        fs::write(
            root.join("guest/manifest.json"),
            json!({"name":"auth-web","organelles":{"alias":"timer"}}).to_string(),
        )
        .unwrap();
        fs::write(
            root.join("guest/.code/lock.json"),
            json!({"modules":{"timer":{"version":"2.10.0"}}}).to_string(),
        )
        .unwrap();
        let result = warnings(&root, &[]).unwrap();
        assert_eq!(result.len(), 3, "{result:?}");
        for expected in ["unused", "old", "auth-web"] {
            assert!(result.iter().any(|r| r.contains(expected)));
        }
        fs::write(root.join(".code/lock.json"), "{bad").unwrap();
        assert!(warnings(&root, &[]).is_err());
        fs::remove_dir_all(root).unwrap();
    }
}
