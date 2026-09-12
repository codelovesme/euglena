use std::collections::{BTreeMap, HashSet};
use std::fs;
use std::io::BufRead;
use std::path::Path;

/// A single organelle entry — either a bare reference string or an object
/// pairing one with a `config` block for its setup particle.
///
/// The reference is looked up two ways at codegen time (see
/// `crate::codegen::organelle_link_target`): a string containing `/` or
/// ending `.so`/`.code` is a literal path (a vendored or locally-built
/// organelle); anything else is a **module name**, resolved through this
/// project's `.code/lock.json` — the file `code install` writes.
pub enum OrganelleEntry {
    /// Simple form: `"term": "console"`.
    Reference(String),
    /// Full form:
    /// `"srv": { "module": "http_server", "config": { "port": "${PORT}" } }`.
    /// `setup` names the configuring particle for a *literal-path* organelle,
    /// where there is no lockfile entry to read it from; for a module name
    /// it is left `None` and codegen reads the lockfile's `setup`.
    /// `hosted` names a **stand-in** to link instead when this application is
    /// being held by a host — see [`OrganelleEntry::hosted`].
    Full {
        reference: String,
        config: serde_json::Map<String, serde_json::Value>,
        setup: Option<String>,
        hosted: Option<String>,
    },
}

impl OrganelleEntry {
    /// The organelle's reference — a module name or a literal path.
    pub fn reference(&self) -> &str {
        match self {
            OrganelleEntry::Reference(r) => r,
            OrganelleEntry::Full { reference, .. } => reference,
        }
    }

    /// The `config` block, if any. `None` for the simple `Reference` variant.
    pub fn config(&self) -> Option<&serde_json::Map<String, serde_json::Value>> {
        match self {
            OrganelleEntry::Reference(_) => None,
            OrganelleEntry::Full { config, .. } => Some(config),
        }
    }

    /// A setup-particle name given explicitly in the entry (for a
    /// literal-path organelle).
    pub fn setup(&self) -> Option<&str> {
        match self {
            OrganelleEntry::Reference(_) => None,
            OrganelleEntry::Full { setup, .. } => setup.as_deref(),
        }
    }

    /// What to link under this alias **instead**, when the application turns
    /// out to be running inside a host:
    ///
    /// ```json
    /// "net": { "module": "net_server", "hosted": "membrane",
    ///          "config": { "port": "8080" } }
    /// ```
    ///
    /// One application, one build, two lives. The alias, the particles and
    /// the `config` block are the same either way, so no gene changes and no
    /// second manifest — only the organelle behind the name differs.
    ///
    /// A door is the reason this exists. Alone an application opens a port;
    /// held it must not, because a thread that outlives it cannot be
    /// unloaded, and an application that cannot be unloaded never gives its
    /// memory back. Both stand-ins must answer the same setup particle,
    /// which is checked at codegen rather than left to fail at runtime.
    pub fn hosted(&self) -> Option<&str> {
        match self {
            OrganelleEntry::Reference(_) => None,
            OrganelleEntry::Full { hosted, .. } => hosted.as_deref(),
        }
    }
}

/// The `code` version an app declares it needs: `"code": ">=1.1.6"`.
///
/// Only a minimum is expressible, and that is the whole design. euglena's own
/// baseline (`exec::MIN_CODE_VERSION`) is what its *generated syntax* needs;
/// this is what the *app* needs — a handler field, a module behaviour, a
/// particle a module only started answering at some version. Those only ever
/// move forward, so a range or a caret would be describing a situation that
/// does not arise, and every extra spelling is one more thing to get wrong in
/// a hand-written JSON file.
///
/// Accepted: `"1.1.6"` and `">=1.1.6"` (spaces after `>=` are fine); both
/// mean the same thing. Anything else is refused by name.
pub fn parse_version_req(raw: &str) -> Result<(u32, u32, u32), String> {
    let trimmed = raw.trim();
    let digits = match trimmed.strip_prefix(">=") {
        Some(rest) => rest.trim(),
        None if trimmed.starts_with(|c: char| c.is_ascii_digit()) => trimmed,
        None => {
            return Err(format!(
                "'{raw}' is not a version requirement — write a minimum, as \"1.1.6\" or \
                 \">=1.1.6\". Ranges, carets and tildes are not supported: a `code` \
                 requirement only ever moves forward."
            ))
        }
    };

    let mut parts = digits.split('.');
    let mut next = |what: &str| -> Result<u32, String> {
        parts
            .next()
            .and_then(|p| p.parse().ok())
            .ok_or_else(|| format!("'{raw}' is missing its {what} number — write \"1.1.6\""))
    };
    let major = next("major")?;
    let minor = next("minor")?;
    let patch = next("patch")?;
    if parts.next().is_some() {
        return Err(format!(
            "'{raw}' has more than three numbers — write \"major.minor.patch\""
        ));
    }
    Ok((major, minor, patch))
}

/// The `code` version `manifest.json` at `path` asks for, if it asks.
///
/// Read on its own rather than through [`parse_manifest`] because the caller
/// is the version check, which runs *before* the interpreter is located and
/// long before anything is generated — it needs one field, not a manifest
/// with its mock overlay applied and its `.env` loaded.
pub fn read_code_requirement(path: &Path) -> Result<Option<(u32, u32, u32)>, String> {
    let text = match fs::read_to_string(path) {
        Ok(text) => text,
        Err(e) => return Err(format!("Cannot read '{}': {}", path.display(), e)),
    };
    let json: serde_json::Value = serde_json::from_str(&text)
        .map_err(|e| format!("Invalid JSON in '{}': {}", path.display(), e))?;
    match json.get("code") {
        None => Ok(None),
        Some(serde_json::Value::String(raw)) => parse_version_req(raw)
            .map(Some)
            .map_err(|e| format!("'code' in '{}': {}", path.display(), e)),
        Some(_) => Err(format!(
            "'code' in '{}' must be a version string, e.g. \">=1.1.6\"",
            path.display()
        )),
    }
}

/// Parsed subset of a project's manifest.json.
pub struct AppManifest {
    /// Cell name — taken from the `"name"` field.
    pub name: String,
    /// Organelle alias → entry (a reference string or `{ module, config }` object).
    pub organelles: BTreeMap<String, OrganelleEntry>,
    /// Genes this application installs rather than writes, by name. Sorted,
    /// so the generated entry is the same on every machine.
    pub genes: Vec<String>,
}

/// Parse the manifest.json at `path` and return an `AppManifest`.
///
/// Before parsing, any `.env` file next to the manifest is loaded into the
/// process environment.  String values in `config` objects are then subject to
/// `${VAR}` interpolation so secrets stay out of version control.
pub fn parse_manifest(path: &Path) -> Result<AppManifest, String> {
    // Load .env from the manifest directory (if present).
    if let Some(dir) = path.parent() {
        load_dotenv(&dir.join(".env"));
    }

    let text =
        fs::read_to_string(path).map_err(|e| format!("Cannot read '{}': {}", path.display(), e))?;

    let mut json: serde_json::Value = serde_json::from_str(&text)
        .map_err(|e| format!("Invalid JSON in '{}': {}", path.display(), e))?;

    // In mock mode, overlay `mock-organelles` onto `organelles` IN MEMORY —
    // never mutates the manifest file on disk. Mocks must live exclusively
    // under `mock-organelles`; `organelles` always describes the real backends.
    //
    // Selection rules:
    //   - `EUGLENA_MOCK_MODE=true` with no `EUGLENA_MOCK_TYPES` → overlay ALL.
    //   - `EUGLENA_MOCK_TYPES=type1,type2`                       → overlay
    //     ONLY entries whose underlying organelle type matches one of the
    //     listed types. The "type" is derived from the entry's `path`
    //     basename with any extension and trailing `_mock`/`-mock` removed
    //     (e.g. `organelles/mongodb_mock.so` → `mongodb`). User input is
    //     normalized: `-` and `_` are equivalent, lowercase.
    //   - Both unset → no overlay.
    if mock_overlay_enabled() {
        let selection = selected_mock_types();
        if let Some(obj) = json.as_object_mut() {
            let mock = obj.get("mock-organelles").cloned();
            if let Some(serde_json::Value::Object(mock_map)) = mock {
                let org_entry = obj
                    .entry("organelles".to_string())
                    .or_insert_with(|| serde_json::Value::Object(serde_json::Map::new()));
                if let serde_json::Value::Object(org_map) = org_entry {
                    for (k, v) in mock_map {
                        if let Some(ref allowed) = selection {
                            match organelle_type_from_value(&v) {
                                Some(t) if allowed.contains(&t) => {
                                    org_map.insert(k, v);
                                }
                                _ => { /* skip: type not in allow-list */ }
                            }
                        } else {
                            // No selection → mock everything (legacy behavior).
                            org_map.insert(k, v);
                        }
                    }
                }
            }
        }
    }

    // Interpolate ${VAR} references throughout the JSON tree.
    interpolate_env_vars(&mut json);

    let name = json
        .get("name")
        .and_then(|v| v.as_str())
        .ok_or_else(|| {
            format!(
                "'name' field missing or not a string in '{}'",
                path.display()
            )
        })?
        .to_string();

    // Validated here as well as in `read_code_requirement`, so a typo in the
    // field is a named error on any path that reads the manifest rather than
    // only on the one that enforces it.
    if let Some(raw) = json.get("code").and_then(|v| v.as_str()) {
        parse_version_req(raw).map_err(|e| format!("'code' in '{}': {}", path.display(), e))?;
    }

    let mut organelles = BTreeMap::new();
    if let Some(org_obj) = json.get("organelles").and_then(|v| v.as_object()) {
        for (alias, val) in org_obj {
            if let Some(s) = val.as_str() {
                organelles.insert(alias.clone(), OrganelleEntry::Reference(s.to_string()));
            } else if let Some(obj) = val.as_object() {
                let reference = obj
                    .get("module")
                    .and_then(|v| v.as_str())
                    .ok_or_else(|| {
                        format!(
                            "organelle '{}' object must have a \"module\" string in '{}'",
                            alias,
                            path.display()
                        )
                    })?
                    .to_string();
                if obj.contains_key("sap") {
                    return Err(format!(
                        "organelle '{}' in '{}' uses \"sap\" — rename it to \"config\". \
                         `Sap` was euglena's own mechanism; a module is configured by the \
                         particle it names in its `setup` (`Config`, `Listen`, …), and \
                         euglena emits that.",
                        alias,
                        path.display()
                    ));
                }
                let config = obj
                    .get("config")
                    .and_then(|v| v.as_object())
                    .cloned()
                    .unwrap_or_default();
                let setup = obj
                    .get("setup")
                    .and_then(|v| v.as_str())
                    .map(str::to_string);
                let hosted = match obj.get("hosted") {
                    None => None,
                    Some(v) => Some(
                        v.as_str()
                            .ok_or_else(|| {
                                format!(
                                    "organelle '{}' in '{}': \"hosted\" must be a string — the \
                                     organelle to link under this name when the application is \
                                     held by a host, e.g. \"hosted\": \"membrane\"",
                                    alias,
                                    path.display()
                                )
                            })?
                            .to_string(),
                    ),
                };
                organelles.insert(
                    alias.clone(),
                    OrganelleEntry::Full {
                        reference,
                        config,
                        setup,
                        hosted,
                    },
                );
            } else {
                return Err(format!(
                    "organelle '{}' must be a string or object in '{}'",
                    alias,
                    path.display()
                ));
            }
        }
    }

    let genes = crate::genes::declared(&json);

    Ok(AppManifest {
        name,
        organelles,
        genes,
    })
}

// ===========================================================================
// .env file support
// ===========================================================================

/// Load a `.env` file into the process environment.
///
/// Each non-empty, non-comment line is parsed as `KEY=VALUE`.  Surrounding
/// quotes on the value (`"..."` or `'...'`) are stripped.  Lines that don't
/// contain `=` are silently skipped.
fn load_dotenv(path: &Path) {
    let file = match fs::File::open(path) {
        Ok(f) => f,
        Err(_) => return, // Missing .env is fine.
    };

    for line in std::io::BufReader::new(file).lines() {
        let line = match line {
            Ok(l) => l,
            Err(_) => continue,
        };
        let trimmed = line.trim();
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }
        if let Some((key, raw_val)) = trimmed.split_once('=') {
            let key = key.trim();
            let val = raw_val.trim();
            // Strip surrounding quotes.
            let val = if (val.starts_with('"') && val.ends_with('"'))
                || (val.starts_with('\'') && val.ends_with('\''))
            {
                &val[1..val.len() - 1]
            } else {
                val
            };
            // SAFETY: set_var is not thread-safe, but this runs during
            // single-threaded manifest parsing before any threads are spawned.
            unsafe {
                std::env::set_var(key, val);
            }
        }
    }
}

/// Returns true if `EUGLENA_MOCK_MODE` is set to a truthy value.
fn mock_mode_enabled() -> bool {
    matches!(
        std::env::var("EUGLENA_MOCK_MODE").as_deref(),
        Ok("1") | Ok("true") | Ok("TRUE") | Ok("True") | Ok("yes")
    )
}

/// True if any kind of mock overlay should be applied — either the global
/// `EUGLENA_MOCK_MODE` flag is on, OR a non-empty `EUGLENA_MOCK_TYPES` is set.
fn mock_overlay_enabled() -> bool {
    if mock_mode_enabled() {
        return true;
    }
    matches!(std::env::var("EUGLENA_MOCK_TYPES"), Ok(ref s) if !s.trim().is_empty())
}

/// Normalize a user-provided or path-derived organelle type name.
/// Replaces `-` with `_` and lowercases. Empty input → empty string.
fn normalize_type(name: &str) -> String {
    name.trim().to_ascii_lowercase().replace('-', "_")
}

/// Parse `EUGLENA_MOCK_TYPES` into a normalized allow-list.
/// Returns `None` when the env var is unset or empty (meaning "no selection",
/// i.e. mock everything when `EUGLENA_MOCK_MODE` is on); returns `Some(set)`
/// when a non-empty comma-separated list is provided.
fn selected_mock_types() -> Option<HashSet<String>> {
    let raw = std::env::var("EUGLENA_MOCK_TYPES").ok()?;
    let set: HashSet<String> = raw
        .split(',')
        .map(normalize_type)
        .filter(|s| !s.is_empty())
        .collect();
    if set.is_empty() {
        None
    } else {
        Some(set)
    }
}

/// Extract the normalized organelle type from a mock-organelles JSON entry.
/// The entry can be either a plain path string or `{ "path": "...", ... }`.
/// Returns `None` if no path can be found.
///
/// Type derivation: take the file basename, strip any extension, then strip
/// a trailing `_mock` or `-mock` suffix. e.g.:
///   - `organelles/mongodb_mock.so`        → `mongodb`
///   - `organelles/blob_storage_mock.so`   → `blob_storage`
///   - `organelles/cloud-drive-mock.wasm`  → `cloud_drive`
fn organelle_type_from_value(v: &serde_json::Value) -> Option<String> {
    let path_str = match v {
        serde_json::Value::String(s) => s.as_str(),
        serde_json::Value::Object(o) => o.get("path")?.as_str()?,
        _ => return None,
    };
    let base = std::path::Path::new(path_str)
        .file_stem()
        .and_then(|s| s.to_str())?;
    let normalized = normalize_type(base);
    let stripped = normalized.strip_suffix("_mock").unwrap_or(&normalized);
    Some(stripped.to_string())
}

/// Recursively walk a JSON value, replacing `${VAR}` patterns in strings
/// with the corresponding environment variable value.  Unknown variables
/// are left as the literal `${VAR}` string.
fn interpolate_env_vars(value: &mut serde_json::Value) {
    match value {
        serde_json::Value::String(s) => {
            if s.contains("${") {
                let interpolated = interpolate_str(s);
                // If the result is a pure number (e.g. "${EUGLENA_PORT}" →
                // "9991"), promote the JSON string to a JSON number so
                // downstream consumers (the config particle's `port`, etc.) get the
                // proper type.
                if let Ok(n) = interpolated.parse::<u64>() {
                    *value = serde_json::Value::Number(n.into());
                } else if let Ok(n) = interpolated.parse::<i64>() {
                    *value = serde_json::Value::Number(n.into());
                } else if let Ok(f) = interpolated.parse::<f64>() {
                    if let Some(num) = serde_json::Number::from_f64(f) {
                        *value = serde_json::Value::Number(num);
                    } else {
                        *s = interpolated;
                    }
                } else {
                    *s = interpolated;
                }
            }
        }
        serde_json::Value::Array(arr) => {
            for item in arr {
                interpolate_env_vars(item);
            }
        }
        serde_json::Value::Object(map) => {
            for (_, v) in map.iter_mut() {
                interpolate_env_vars(v);
            }
        }
        _ => {}
    }
}

/// Replace all `${VAR}` occurrences in `input` with env var values.
fn interpolate_str(input: &str) -> String {
    let mut result = String::with_capacity(input.len());
    let mut chars = input.chars().peekable();

    while let Some(c) = chars.next() {
        if c == '$' && chars.peek() == Some(&'{') {
            chars.next(); // consume '{'
            let mut var_name = String::new();
            for ch in chars.by_ref() {
                if ch == '}' {
                    break;
                }
                var_name.push(ch);
            }
            match std::env::var(&var_name) {
                Ok(val) => result.push_str(&val),
                Err(_) => {
                    // Unset variable — substitute empty string so that the
                    // generated Code source remains parseable.  The organelle
                    // will fail gracefully at runtime if a connection string
                    // or secret is missing.
                }
            }
        } else {
            result.push(c);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_req_accepts_both_spellings_of_a_minimum() {
        assert_eq!(parse_version_req("1.1.6"), Ok((1, 1, 6)));
        assert_eq!(parse_version_req(">=1.1.6"), Ok((1, 1, 6)));
        assert_eq!(parse_version_req(">= 1.1.6"), Ok((1, 1, 6)));
        assert_eq!(parse_version_req("  1.1.6  "), Ok((1, 1, 6)));
    }

    /// Every rejection names what it read, because the field is hand-written
    /// JSON and the fix is always "write it the other way".
    #[test]
    fn version_req_rejects_what_it_does_not_mean() {
        for bad in ["^1.1.6", "~1.1.6", ">1.1.6", "1.1.6 - 2.0.0", "latest", ""] {
            let err = parse_version_req(bad).unwrap_err();
            assert!(
                err.contains(bad) || bad.is_empty(),
                "'{bad}' should be quoted back: {err}"
            );
        }
    }

    #[test]
    fn version_req_wants_all_three_numbers() {
        assert!(parse_version_req("1.1").is_err());
        assert!(parse_version_req("1").is_err());
        assert!(parse_version_req("1.1.6.2").unwrap_err().contains("three"));
    }

    #[test]
    fn code_requirement_is_optional_and_typed() {
        let dir = std::env::temp_dir().join(format!("euglena_req_{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        let path = dir.join("manifest.json");

        fs::write(&path, r#"{"name":"x","organelles":{}}"#).unwrap();
        assert_eq!(read_code_requirement(&path), Ok(None));

        fs::write(&path, r#"{"name":"x","code":">=1.1.6","organelles":{}}"#).unwrap();
        assert_eq!(read_code_requirement(&path), Ok(Some((1, 1, 6))));

        // A number is not a version requirement, and guessing at one would be
        // worse than saying so.
        fs::write(&path, r#"{"name":"x","code":1.1,"organelles":{}}"#).unwrap();
        assert!(read_code_requirement(&path).unwrap_err().contains("string"));

        let _ = fs::remove_dir_all(&dir);
    }
}
