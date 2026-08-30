//! Minimal reader for a project's `.code/lock.json` — the file `code
//! install` writes and pins by sha256. euglena never writes to it; `code
//! install`/`code remove` own it. This only reads what is already there, so
//! codegen can turn an organelle's module name into the asset `code install`
//! actually laid down (platform-suffixed, e.g. `terminal-linux-x86_64.so`).

use std::fs;
use std::path::Path;

pub struct LockedModule {
    pub version: String,
    pub asset: String,
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
    })
}
