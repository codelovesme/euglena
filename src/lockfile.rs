//! Minimal reader for a project's `.code/lock.json` — the file `code
//! install` writes and pins by sha256. euglena never writes to it; `code
//! install`/`code uninstall` own it. This only reads what is already there, so
//! codegen can confirm an organelle is installed, pick the right native
//! extension (`.so` / `.a`) from the asset `code install` laid down, and —
//! for an organelle carrying a `config` block — learn which particle
//! configures it (`setup`, copied there from the module's `module.json`).

use std::fs;
use std::path::Path;

pub struct LockedModule {
    pub version: String,
    pub asset: String,
    /// The module's setup handler — `"Config"` for a stateful module,
    /// `"Listen"` for `http_server`, `None` for a stateless one. Absent in a
    /// lockfile written before `code` recorded it.
    pub setup: Option<String>,
}

/// Look up `module_name` in `<project_root>/.code/lock.json`. `None` covers
/// every reason it isn't there: no lockfile, malformed JSON, or simply no
/// entry for that name — callers only need to distinguish "found" from "not
/// installed here yet".
pub fn read(project_root: &Path, module_name: &str) -> Option<LockedModule> {
    let lock_path = project_root.join(".code").join("lock.json");
    let text = fs::read_to_string(lock_path).ok()?;
    let json: serde_json::Value = serde_json::from_str(&text).ok()?;
    let entry = json.get("modules")?.get(module_name)?;
    Some(LockedModule {
        version: entry.get("version")?.as_str()?.to_string(),
        asset: entry.get("asset")?.as_str()?.to_string(),
        setup: entry
            .get("setup")
            .and_then(|v| v.as_str())
            .map(str::to_string),
    })
}
