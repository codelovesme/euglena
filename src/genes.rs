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
    pub source: Option<String>,
}

pub fn locked(project_root: &Path, name: &str) -> Option<LockedGene> {
    let text = fs::read_to_string(lock_path(project_root)).ok()?;
    let json: serde_json::Value = serde_json::from_str(&text).ok()?;
    let entry = json.get("genes")?.get(name)?;
    Some(LockedGene {
        version: entry.get("version")?.as_str()?.to_string(),
        asset: entry.get("asset")?.as_str()?.to_string(),
        sha256: entry.get("sha256")?.as_str()?.to_string(),
        source: entry
            .get("source")
            .and_then(|v| v.as_str())
            .map(str::to_string),
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

/// How a gene is fetched, which decides what the lock may do.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Fetch {
    /// What the lock says, exactly: its version, from its release, and bytes
    /// that hash to its sha256. A bare `euglena install` and a build that
    /// finds a gene missing fetch this way — a fresh checkout gets what the
    /// application was built with, and the lock does not move.
    Pinned,
    /// The lock's version again, taking whatever bytes it now holds. Naming
    /// a gene does this: it is how a republish at the same version is
    /// picked up. A gene not pinned yet is fetched at this euglena's own.
    Refetch,
    /// This euglena's own release: `euglena install --upgrade`, the one way a
    /// pin moves to a different version.
    Upgrade,
}

/// Fetch every gene a manifest declares that is not already installed and
/// verified (or, upgrading, not already at this euglena's version). One
/// failure does not stop the rest: a fresh checkout missing three genes
/// should learn that in one run.
pub fn install_declared(
    project_root: &Path,
    manifest: &serde_json::Value,
    upgrade: bool,
) -> Result<usize, String> {
    let names = declared(manifest);
    if names.is_empty() {
        return Ok(0);
    }
    let mut failed = Vec::new();
    for name in &names {
        let current =
            installed_path(project_root, name).is_some() && verify(project_root, name).is_ok();
        let at_tool = locked(project_root, name).is_some_and(|p| p.version == tool_version());
        if current && (!upgrade || at_tool) {
            continue;
        }
        let how = if upgrade {
            Fetch::Upgrade
        } else {
            Fetch::Pinned
        };
        println!("installing gene {name}...");
        if let Err(e) = install_one(project_root, name, how) {
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

/// The genes a manifest declares that are pinned but not on disk, fetched
/// from the lock before an entry is generated — so a fresh checkout, a new
/// worktree or another machine builds on the first try rather than being
/// told to run `euglena install`. Nothing is upgraded and nothing new is
/// pinned here: a declared gene with no pin still asks for an install.
pub fn fetch_missing(project_root: &Path) -> Result<(), String> {
    let Ok(text) = fs::read_to_string(project_root.join("manifest.json")) else {
        return Ok(());
    };
    let Ok(manifest) = serde_json::from_str::<serde_json::Value>(&text) else {
        return Ok(());
    };
    for name in &declared(&manifest) {
        if installed_path(project_root, name).is_some() {
            continue;
        }
        let Some(pinned) = locked(project_root, name) else {
            continue;
        };
        eprintln!(
            "euglena: gene {name}@{} is pinned but not installed — fetching it",
            pinned.version
        );
        install_one(project_root, name, Fetch::Pinned)?;
    }
    Ok(())
}

fn tool_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

fn triple(version: &str) -> Option<(u32, u32, u32)> {
    let mut parts = version.split('.').map(|p| p.parse::<u32>().ok());
    let t = (parts.next()??, parts.next()??, parts.next()??);
    parts.next().is_none().then_some(t)
}

/// Where a gene comes from and which version that is, before anything is
/// fetched. A pin newer than this euglena is refused here: a gene and the
/// euglena that ships it are released together, and an older euglena
/// rewriting the pin down to its own release (which once happened, with
/// 0.9.0 and a 0.10.0 lock) breaks every application that relied on it.
fn source_for(
    project_root: &Path,
    name: &str,
    how: Fetch,
) -> Result<(String, Option<LockedGene>), String> {
    let pinned = match how {
        Fetch::Upgrade => None,
        Fetch::Pinned | Fetch::Refetch => locked(project_root, name),
    };
    // A registry pointed at on purpose is used as it is: that is how a gene
    // is tried before it is published.
    if std::env::var("EUGLENA_GENE_RELEASE").is_ok() {
        return Ok((release_base(), pinned));
    }
    let Some(pin) = pinned else {
        return Ok((release_base(), None));
    };
    if let (Some(want), Some(have)) = (triple(&pin.version), triple(tool_version())) {
        if want > have {
            return Err(format!(
                ".code/lock.json pins the gene '{name}' at {}, newer than this euglena                  ({}) — upgrade euglena (`cdlvsm install euglena`); the lock was left as it is",
                pin.version,
                tool_version()
            ));
        }
    }
    let base = match &pin.source {
        Some(source) if source.starts_with("https://") => source.trim_end_matches('/').to_string(),
        _ => format!(
            "https://github.com/codelovesme/euglena/releases/download/v{}",
            pin.version
        ),
    };
    Ok((base, Some(pin)))
}

/// One gene: its metadata, then its bytes, then the pin — in that order, so
/// a refusal never leaves a file behind that nothing names.
pub fn install_one(project_root: &Path, name: &str, how: Fetch) -> Result<(), String> {
    let (base, pinned) = source_for(project_root, name, how)?;
    let version = pinned
        .as_ref()
        .map(|p| p.version.clone())
        .unwrap_or_else(|| tool_version().to_string());
    let asset = format!("{name}.gene.code");

    // The metadata says what the bytes should hash to. Fetching it first
    // means a typo'd name fails before anything is written.
    let meta_text = fetch(&format!("{base}/{name}.gene.json"))
        .map_err(|e| format!("no gene called '{name}' in the registry ({e})"))?;
    let meta: serde_json::Value = serde_json::from_str(&meta_text)
        .map_err(|e| format!("the registry's entry for '{name}' is not JSON: {e}"))?;
    // Read as a package description (`crate::package`): a legacy entry as it
    // always was, a schema-1 one checked whole — and one this euglena cannot
    // read refused here, before anything is written or any pin moves.
    let description = crate::package::parse(&meta)
        .map_err(|e| format!("the registry's entry for '{name}': {e}"))?;
    if description.name != name {
        return Err(format!(
            "the registry's entry for '{name}' describes '{}'",
            description.name
        ));
    }
    let expected = description.sha256.as_str();
    let version = description.version.clone().unwrap_or(version);
    if let Some(pin) = &pinned {
        if version != pin.version {
            return Err(format!(
                "the registry at {base} holds '{name}' {version}, but .code/lock.json pins \
                 {} — the lock was left as it is",
                pin.version
            ));
        }
        // Exactly what was pinned, unless the gene was named: naming it is
        // how a republish at the same version is taken on purpose.
        if how == Fetch::Pinned && expected != pin.sha256 {
            return Err(format!(
                "'{name}' {version} was republished since it was pinned (the lock has \
                 sha256 {}, the registry {expected}) — run `euglena install {name}` to \
                 take the new bytes",
                pin.sha256
            ));
        }
    }

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
    // The description beside the bytes it describes, so what the package
    // needs and answers can be read without the registry.
    fs::write(dir.join(format!("{name}.gene.json")), meta_text.as_bytes())
        .map_err(|e| format!("cannot write {}: {e}", dir.display()))?;

    pin(project_root, name, &version, &base, &asset, &found)?;
    // On stderr: a build that fetches a missing gene must not put words in
    // front of the program's own output.
    eprintln!("installed gene {name}@{version} (sha256 {found})");
    eprintln!("  {}", dir.join(&asset).display());
    Ok(())
}

/// Write the lockfile's `genes` section, leaving `modules` exactly as it was
/// — that section is `code install`'s and euglena does not own it.
fn pin(
    project_root: &Path,
    name: &str,
    version: &str,
    source: &str,
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
            "source": source,
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
