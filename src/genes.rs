//! Genes an application installs rather than writes.
//!
//! An organelle is `code`'s: a native artifact with an ABI, reached through
//! an alias. A **gene** is euglena's: `.code` source whose handlers join the
//! program-wide table, exactly like the app's own `src/*.gene.code`. So a
//! shared palette, a shared clock, a shared anything is written once and
//! installed, rather than copied into every application that wants it.
//!
//! **Source, not an artifact, and that is not a compromise.** A compiled
//! `.so`/`.a` *is* a module: its handlers are reachable only through an
//! alias, which is the one thing a gene must not have. Source also has no
//! per-platform matrix — one file serves a native build, a browser build and
//! a held one alike, where a module needs an artifact per target and only
//! seven of them exist for wasm at all.
//!
//! The registry is release artifacts, the way modules are. This is only the
//! package manager: it resolves what a manifest declares, fetches it,
//! verifies its sha256, lays it down under `.code/genes/`, and pins it in
//! `.code/lock.json` beside — but not among — the modules.

use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

/// Where a gene's bytes live once installed, mirroring `.code/modules/`.
pub const GENES_DIR: &str = "genes";

/// The release these are fetched from. A gene ships with euglena and carries
/// euglena's own version, so an application holding euglena 0.4.0 and
/// `palette 0.4.0` never has to ask whether the two agree — the same promise
/// `code` makes about itself and its modules.
fn release_base() -> String {
    if let Ok(url) = std::env::var("EUGLENA_GENE_RELEASE") {
        return url.trim_end_matches('/').to_string();
    }
    format!(
        "https://github.com/codelovesme/euglena/releases/download/v{}",
        env!("CARGO_PKG_VERSION")
    )
}

/// The genes a manifest declares: `"genes": ["palette", "clock"]`.
///
/// Names only, like organelles — the version is the lockfile's business, so
/// a manifest never goes stale against a release.
pub fn declared(manifest: &serde_json::Value) -> Vec<String> {
    let Some(list) = manifest.get("genes") else {
        return Vec::new();
    };
    let mut names: Vec<String> = match list {
        serde_json::Value::Array(items) => items
            .iter()
            .filter_map(|v| v.as_str().map(str::to_string))
            .collect(),
        // An object is accepted too, so `{"palette": "0.4.0"}` from a hand
        // written manifest is read rather than silently ignored. The value
        // is not a version pin: the lockfile pins.
        serde_json::Value::Object(map) => map.keys().cloned().collect(),
        _ => Vec::new(),
    };
    names.sort();
    names.dedup();
    names
}

/// A gene pinned in `.code/lock.json`, under its own `genes` section.
pub struct LockedGene {
    pub version: String,
    pub asset: String,
    pub sha256: String,
}

pub fn locked(project_root: &Path, name: &str) -> Option<LockedGene> {
    let text = fs::read_to_string(lock_path(project_root)).ok()?;
    let json: serde_json::Value = serde_json::from_str(&text).ok()?;
    let entry = json.get("genes")?.get(name)?;
    Some(LockedGene {
        version: entry.get("version")?.as_str()?.to_string(),
        asset: entry.get("asset")?.as_str()?.to_string(),
        sha256: entry.get("sha256")?.as_str()?.to_string(),
    })
}

/// Where codegen links a gene from, relative to the project root: the path
/// under `.code/genes/` its pin names. `None` when it is declared but not
/// installed — codegen turns that into a message naming `euglena install`,
/// the same as an organelle that was never fetched.
pub fn installed_path(project_root: &Path, name: &str) -> Option<PathBuf> {
    let pinned = locked(project_root, name)?;
    let path = PathBuf::from(".code")
        .join(GENES_DIR)
        .join(name)
        .join(&pinned.version)
        .join(&pinned.asset);
    project_root.join(&path).is_file().then_some(path)
}

/// Re-check the bytes against the pin before they are compiled in.
///
/// The same rule `code`'s loader keeps for a module: a gene edited in place
/// is refused rather than quietly built into the application, because an
/// installed file nobody wrote is the one place a change is invisible.
pub fn verify(project_root: &Path, name: &str) -> Result<(), String> {
    let Some(pinned) = locked(project_root, name) else {
        return Ok(());
    };
    let Some(path) = installed_path(project_root, name) else {
        return Ok(());
    };
    let bytes = fs::read(project_root.join(&path))
        .map_err(|e| format!("cannot read the installed gene '{name}': {e}"))?;
    let found = crate::sha256::hex(&bytes);
    if found != pinned.sha256 {
        return Err(format!(
            "refusing to use '{}': it does not match the sha256 pinned in \
             .code/lock.json — re-run `euglena install {name}`",
            path.display()
        ));
    }
    Ok(())
}

fn lock_path(project_root: &Path) -> PathBuf {
    project_root.join(".code").join("lock.json")
}

/// Fetch every gene a manifest declares that is not already installed and
/// verified. One failure does not stop the rest: a fresh checkout missing
/// three genes should learn that in one run.
pub fn install_declared(
    project_root: &Path,
    manifest: &serde_json::Value,
) -> Result<usize, String> {
    let names = declared(manifest);
    if names.is_empty() {
        return Ok(0);
    }
    let mut failed = Vec::new();
    for name in &names {
        if installed_path(project_root, name).is_some() && verify(project_root, name).is_ok() {
            continue;
        }
        println!("installing gene {name}...");
        if let Err(e) = install_one(project_root, name) {
            eprintln!("euglena: {e}");
            failed.push(name.clone());
        }
    }
    if failed.is_empty() {
        return Ok(names.len());
    }
    Err(format!(
        "could not install {} of {} gene(s): {}",
        failed.len(),
        names.len(),
        failed.join(", ")
    ))
}

/// One gene: its metadata, then its bytes, then the pin — in that order, so
/// a refusal never leaves a file behind that nothing names.
pub fn install_one(project_root: &Path, name: &str) -> Result<(), String> {
    let base = release_base();
    let version = env!("CARGO_PKG_VERSION").to_string();
    let asset = format!("{name}.gene.code");

    // The metadata says what the bytes should hash to. Fetching it first
    // means a typo'd name fails before anything is written.
    let meta_text = fetch(&format!("{base}/{name}.gene.json"))
        .map_err(|e| format!("no gene called '{name}' in the registry ({e})"))?;
    let meta: serde_json::Value = serde_json::from_str(&meta_text)
        .map_err(|e| format!("the registry's entry for '{name}' is not JSON: {e}"))?;
    let expected = meta
        .get("sha256")
        .and_then(|v| v.as_str())
        .ok_or_else(|| format!("the registry's entry for '{name}' names no sha256"))?;
    let version = meta
        .get("version")
        .and_then(|v| v.as_str())
        .unwrap_or(&version)
        .to_string();

    let bytes = fetch_bytes(&format!("{base}/{asset}"))
        .map_err(|e| format!("cannot fetch the gene '{name}': {e}"))?;
    let found = crate::sha256::hex(&bytes);
    if found != expected {
        return Err(format!(
            "the gene '{name}' does not match the sha256 the registry published \
             (expected {expected}, got {found})"
        ));
    }

    let dir = project_root
        .join(".code")
        .join(GENES_DIR)
        .join(name)
        .join(&version);
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
    fs::write(dir.join(&asset), &bytes)
        .map_err(|e| format!("cannot write {}: {e}", dir.display()))?;

    pin(project_root, name, &version, &asset, &found)?;
    println!("installed gene {name}@{version} (sha256 {found})");
    println!("  {}", dir.join(&asset).display());
    Ok(())
}

/// Write the lockfile's `genes` section, leaving `modules` exactly as it was
/// — that section is `code install`'s and euglena does not own it.
fn pin(
    project_root: &Path,
    name: &str,
    version: &str,
    asset: &str,
    sha256: &str,
) -> Result<(), String> {
    let path = lock_path(project_root);
    let mut json: serde_json::Value = match fs::read_to_string(&path) {
        Ok(text) => {
            serde_json::from_str(&text).map_err(|e| format!("malformed {}: {e}", path.display()))?
        }
        Err(_) => serde_json::json!({}),
    };
    if !json.is_object() {
        json = serde_json::json!({});
    }
    let genes = json
        .as_object_mut()
        .unwrap()
        .entry("genes")
        .or_insert_with(|| serde_json::json!({}));
    if !genes.is_object() {
        *genes = serde_json::json!({});
    }
    genes.as_object_mut().unwrap().insert(
        name.to_string(),
        serde_json::json!({
            "name": name,
            "version": version,
            "source": release_base(),
            "asset": asset,
            "sha256": sha256,
        }),
    );

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("cannot create {}: {e}", parent.display()))?;
    }
    let text = serde_json::to_string_pretty(&json)
        .map_err(|e| format!("cannot serialise the lockfile: {e}"))?;
    fs::write(&path, text + "\n").map_err(|e| format!("cannot write {}: {e}", path.display()))
}

/// Drop a gene's pin and its bytes. The manifest is the caller's business.
pub fn remove_installed(project_root: &Path, name: &str) -> Result<(), String> {
    let dir = project_root.join(".code").join(GENES_DIR).join(name);
    if dir.is_dir() {
        fs::remove_dir_all(&dir).map_err(|e| format!("cannot remove {}: {e}", dir.display()))?;
    }
    let path = lock_path(project_root);
    let Ok(text) = fs::read_to_string(&path) else {
        return Ok(());
    };
    let Ok(mut json) = serde_json::from_str::<serde_json::Value>(&text) else {
        return Ok(());
    };
    if let Some(genes) = json.get_mut("genes").and_then(|g| g.as_object_mut()) {
        genes.remove(name);
    }
    let text = serde_json::to_string_pretty(&json)
        .map_err(|e| format!("cannot serialise the lockfile: {e}"))?;
    fs::write(&path, text + "\n").map_err(|e| format!("cannot write {}: {e}", path.display()))
}

/// `curl`, for the same reason `code install` uses it: euglena promises to
/// need nothing but clap and serde_json, and an HTTP stack is a large thing
/// to owe a user for one download.
fn fetch_bytes(url: &str) -> Result<Vec<u8>, String> {
    let mut args: Vec<&str> = vec!["-fsSL"];
    // https for the registry, and nothing else — except when the registry
    // has been pointed somewhere else on purpose, which is how a gene is
    // tried before it is published.
    if url.starts_with("https://") {
        args.extend(["--proto", "=https"]);
    } else if std::env::var("EUGLENA_GENE_RELEASE").is_err() {
        return Err(format!("refusing to fetch {url} over anything but https"));
    }
    args.push(url);
    let out = Command::new("curl")
        .args(&args)
        .output()
        .map_err(|e| format!("cannot run curl: {e}"))?;
    if !out.status.success() {
        return Err(format!("{url} could not be fetched"));
    }
    Ok(out.stdout)
}

fn fetch(url: &str) -> Result<String, String> {
    let bytes = fetch_bytes(url)?;
    String::from_utf8(bytes).map_err(|_| format!("{url} is not text"))
}
