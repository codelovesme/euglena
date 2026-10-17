//! Shell/guest dependency checks use declarations only: no dotenv or mock state.
use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

fn read(root: &Path) -> Result<serde_json::Value, String> {
    let path = root.join("manifest.json");
    let text =
        fs::read_to_string(&path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
    serde_json::from_str(&text).map_err(|e| format!("invalid {}: {e}", path.display()))
}

fn modules(json: &serde_json::Value) -> Result<Vec<(&str, &str)>, String> {
    let Some(entries) = json.get("organelles") else {
        return Ok(Vec::new());
    };
    let entries = entries.as_object().ok_or("organelles must be an object")?;
    entries
        .iter()
        .map(|(alias, entry)| {
            let reference = entry
                .as_str()
                .or_else(|| entry.get("module").and_then(|v| v.as_str()))
                .ok_or_else(|| format!("organelle '{alias}' must name a module"))?;
            Ok((alias.as_str(), reference))
        })
        .collect()
}

/// Declared guest paths are relative to the shell; CLI paths to the caller.
/// Deliberately compares module identities, not the application's alias names.
pub fn check(root: &Path, extra: &[PathBuf]) -> Result<usize, String> {
    if !root.join("manifest.json").exists() && extra.is_empty() {
        return Ok(0);
    }
    let shell = read(root)?;
    let mut guests = BTreeSet::new();
    if let Some(value) = shell.get("guests") {
        for value in value
            .as_array()
            .ok_or("guests must be an array of project paths")?
        {
            let path = value
                .as_str()
                .filter(|s| !s.is_empty())
                .ok_or("guests must contain nonempty project paths")?;
            guests.insert(root.join(path));
        }
    }
    guests.extend(extra.iter().cloned());
    if guests.is_empty() {
        return Ok(0);
    }
    if shell.get("runtime").and_then(|v| v.as_str()) != Some("web") {
        return Err("a shell declaring guests must have runtime = web".into());
    }
    let supplied: BTreeSet<_> = modules(&shell)?.into_iter().map(|(_, name)| name).collect();
    let mut errors = Vec::new();
    for path in &guests {
        let guest = read(path)?;
        let name = guest
            .get("name")
            .and_then(|v| v.as_str())
            .unwrap_or("<unnamed>");
        if guest.get("runtime").and_then(|v| v.as_str()) != Some("web") {
            return Err(format!(
                "guest '{name}' at {} must have runtime = web",
                path.display()
            ));
        }
        for (alias, module) in modules(&guest)? {
            if !supplied.contains(module) {
                errors.push(format!("guest '{name}' ({}) alias '{alias}' needs module '{module}'; add it to the shell's organelles", path.display()));
            }
        }
    }
    if errors.is_empty() {
        Ok(guests.len())
    } else {
        Err(errors.join("\n"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    fn fixture(tag: &str) -> PathBuf {
        let root =
            std::env::temp_dir().join(format!("euglena-hosting-{}-{tag}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join("guest")).unwrap();
        fs::write(root.join("manifest.json"), json!({"name":"shell","runtime":"web","guests":["guest"],"organelles":{"different":"timer","extra":"dom"}}).to_string()).unwrap();
        fs::write(root.join("guest/manifest.json"), json!({"name":"auth-web","runtime":"web","organelles":{"clock":{"module":"timer","config":{"secret":"${NOT_LOADED}"}}}}).to_string()).unwrap();
        root
    }
    #[test]
    fn matches_modules_instead_of_aliases_and_ignores_guest_environment() {
        let root = fixture("aliases");
        fs::write(
            root.join("guest/.env"),
            "HOSTING_TEST_MUST_NOT_LOAD=secret\n",
        )
        .unwrap();
        assert_eq!(check(&root, &[]).unwrap(), 1);
        assert!(std::env::var_os("HOSTING_TEST_MUST_NOT_LOAD").is_none());
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn missing_module_names_guest_alias_and_module() {
        let root = fixture("missing");
        fs::write(
            root.join("manifest.json"),
            json!({"runtime":"web","guests":["guest"],"organelles":{"clock":"time"}}).to_string(),
        )
        .unwrap();
        let error = check(&root, &[]).unwrap_err();
        for part in ["auth-web", "clock", "timer"] {
            assert!(error.contains(part), "{error}");
        }
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn explicit_guests_and_invalid_declarations_are_checked() {
        let root = fixture("invalid");
        fs::write(
            root.join("manifest.json"),
            json!({"runtime":"web","organelles":{"clock":"timer"}}).to_string(),
        )
        .unwrap();
        assert_eq!(check(&root, &[root.join("guest")]).unwrap(), 1);
        assert!(check(&root, &[root.join("absent")])
            .unwrap_err()
            .contains("absent"));
        for guests in [json!(null), json!("guest"), json!([false]), json!([""])] {
            fs::write(
                root.join("manifest.json"),
                json!({"runtime":"web","guests":guests}).to_string(),
            )
            .unwrap();
            assert!(check(&root, &[]).is_err());
        }
        fs::remove_dir_all(root).unwrap();
    }
}
