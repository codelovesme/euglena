//! Genes an application installs rather than writes.
//!
//! A gene is `.code` source whose handlers join the one program-wide table,
//! so there is no alias and no namespace — which is exactly why the things
//! worth testing here are the ones a reader cannot see: that the bytes match
//! what was published, that the pin lives in its own section of the lockfile
//! rather than among the modules, and that the generated entry links an
//! installed gene *before* the application's own.
//!
//! These run against a registry on disk, through `EUGLENA_GENE_RELEASE` —
//! which is also how a gene is tried before it is published. Nothing here
//! reaches the network.

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;

fn bin() -> &'static str {
    env!("CARGO_BIN_EXE_euglena")
}

fn tmp_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("euglena_genes_{}_{}", std::process::id(), tag));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

/// A `cdlvsm-code` that satisfies the version check and does nothing else,
/// so `euglena run` reaches codegen and writes a real `main.code` without CI
/// needing an interpreter.
fn fake_code_on_path(dir: &Path) -> PathBuf {
    let bindir = dir.join("bin");
    fs::create_dir_all(&bindir).unwrap();
    let shim = bindir.join("cdlvsm-code");
    fs::write(
        &shim,
        "#!/bin/sh\nif [ \"$1\" = \"--version\" ]; then echo 'Code v9.9.9-fake'; fi\nexit 0\n",
    )
    .unwrap();
    let mut perms = fs::metadata(&shim).unwrap().permissions();
    perms.set_mode(0o755);
    fs::set_permissions(&shim, perms).unwrap();
    // The shim first, and then the real PATH — `curl` is how a gene is
    // fetched, registry on disk or not.
    match std::env::var("PATH") {
        Ok(rest) => format!("{}:{rest}", bindir.display()).into(),
        Err(_) => bindir,
    }
}

/// The digest, computed by something other than the code under test — a test
/// that hashes with the same function it is checking proves nothing.
fn sha256_of(path: &Path) -> String {
    let out = Command::new("sha256sum")
        .arg(path)
        .output()
        .expect("sha256sum");
    String::from_utf8_lossy(&out.stdout)
        .split_whitespace()
        .next()
        .expect("sha256sum printed nothing")
        .to_string()
}

struct App {
    work: PathBuf,
    root: PathBuf,
    home: PathBuf,
    path: PathBuf,
    registry: PathBuf,
}

impl App {
    /// Scaffold an app with a registry of its own beside it.
    fn new(tag: &str) -> App {
        let work = tmp_dir(tag);
        let home = work.join("home");
        fs::create_dir_all(&home).unwrap();
        let path = fake_code_on_path(&work);
        let registry = work.join("registry");
        fs::create_dir_all(&registry).unwrap();

        let init = Command::new(bin())
            .args(["init", "demo"])
            .current_dir(&work)
            .env("HOME", &home)
            .status()
            .unwrap();
        assert!(init.success(), "euglena init failed");

        App {
            root: work.join("demo"),
            work,
            home,
            path,
            registry,
        }
    }

    /// Publish a gene: its source, and the metadata naming the digest.
    fn publish(&self, name: &str, version: &str, body: &str) {
        let asset = format!("{name}.gene.code");
        fs::write(self.registry.join(&asset), body).unwrap();
        let sum = sha256_of(&self.registry.join(&asset));
        fs::write(
            self.registry.join(format!("{name}.gene.json")),
            format!(
                "{{\"name\":\"{name}\",\"version\":\"{version}\",\
                  \"asset\":\"{asset}\",\"sha256\":\"{sum}\"}}\n"
            ),
        )
        .unwrap();
    }

    /// Rewrite a published gene's bytes behind its metadata's back.
    fn tamper_with_the_registry(&self, name: &str, body: &str) {
        fs::write(self.registry.join(format!("{name}.gene.code")), body).unwrap();
    }

    fn euglena(&self, args: &[&str]) -> (bool, String) {
        let out = Command::new(bin())
            .args(args)
            .current_dir(&self.root)
            .env("HOME", &self.home)
            .env("PATH", &self.path)
            .env(
                "EUGLENA_GENE_RELEASE",
                format!("file://{}", self.registry.display()),
            )
            .output()
            .unwrap();
        let combined = format!(
            "{}{}",
            String::from_utf8_lossy(&out.stdout),
            String::from_utf8_lossy(&out.stderr)
        );
        (out.status.success(), combined)
    }

    fn installed(&self, name: &str, version: &str) -> PathBuf {
        self.root
            .join(".code")
            .join("genes")
            .join(name)
            .join(version)
            .join(format!("{name}.gene.code"))
    }

    fn lock(&self) -> serde_json::Value {
        let text = fs::read_to_string(self.root.join(".code").join("lock.json")).unwrap();
        serde_json::from_str(&text).unwrap()
    }

    fn manifest(&self) -> serde_json::Value {
        let text = fs::read_to_string(self.root.join("manifest.json")).unwrap();
        serde_json::from_str(&text).unwrap()
    }

    fn entry(&self) -> String {
        fs::read_to_string(self.root.join("main.code")).unwrap()
    }

    fn cleanup(self) {
        let _ = fs::remove_dir_all(&self.work);
    }
}

const PALETTE: &str = "Palette =>\n    return Colours { bg = \"#0d1117\" }\n";

/// The whole path, in one test because the parts are only interesting
/// together: declared, fetched, verified, pinned under `genes`, and linked
/// into the generated entry ahead of the application's own genes.
#[test]
fn a_gene_is_installed_pinned_and_linked_before_the_app_s_own() {
    let app = App::new("install");
    app.publish("palette", "9.9.9", PALETTE);

    let (ok, out) = app.euglena(&["install", "palette", "--gene"]);
    assert!(ok, "install --gene failed:\n{out}");

    // The bytes land under a path naming the gene and its version.
    let installed = app.installed("palette", "9.9.9");
    assert!(installed.is_file(), "not written to {installed:?}:\n{out}");
    assert_eq!(fs::read_to_string(&installed).unwrap(), PALETTE);

    // Installing by name also makes the manifest say so, so a fresh
    // checkout gets the same gene from `euglena install` alone.
    assert_eq!(app.manifest()["genes"][0], "palette");

    // The pin is in `genes`, not among the modules. They are different kinds
    // of thing — an artifact with an ABI against source that links into the
    // root — and the lockfile is where that stops being a matter of opinion.
    let lock = app.lock();
    let pinned = &lock["genes"]["palette"];
    assert_eq!(pinned["version"], "9.9.9");
    assert_eq!(pinned["asset"], "palette.gene.code");
    assert_eq!(pinned["sha256"], sha256_of(&installed));
    assert!(
        lock.get("modules").and_then(|m| m.get("palette")).is_none(),
        "a gene must not be pinned as a module:\n{lock:#}"
    );

    // And the entry links it first.
    let (ok, out) = app.euglena(&["run"]);
    assert!(ok, "run should regenerate the entry:\n{out}");
    let entry = app.entry();
    let gene_link = entry
        .find("link \".code/genes/palette/9.9.9/palette.gene.code\"")
        .unwrap_or_else(|| panic!("the installed gene is not linked:\n{entry}"));
    let own_link = entry
        .find("link \"src/")
        .unwrap_or_else(|| panic!("the app's own genes are not linked:\n{entry}"));
    assert!(
        gene_link < own_link,
        "an installed gene should be linked before the app's own:\n{entry}"
    );

    // The pin is written into the body, not just the path — see below.
    assert!(
        entry.contains("| gene palette@9.9.9 sha256:"),
        "the entry should record the pin:\n{entry}"
    );

    app.cleanup();
}

/// A gene republished at the same version changes nothing about the *path*
/// the entry names, so without the pin in the body every application would
/// go on reporting "up to date" while compiling in bytes that had changed.
#[test]
fn a_gene_republished_at_the_same_version_makes_the_entry_stale() {
    let app = App::new("stale");
    app.publish("palette", "9.9.9", PALETTE);
    assert!(app.euglena(&["install", "palette", "--gene"]).0);
    assert!(app.euglena(&["run"]).0);

    let (ok, out) = app.euglena(&["doctor"]);
    assert!(ok, "doctor should pass after a run:\n{out}");
    assert!(out.contains("main.code: up to date"), "got:\n{out}");

    // Same name, same version, different bytes. Naming the gene refetches
    // it; a bare `euglena install` keeps whatever already verifies, which is
    // what a fresh checkout wants and not what this is testing.
    app.publish(
        "palette",
        "9.9.9",
        "Palette =>\n    return Colours { bg = \"#fff\" }\n",
    );
    let (ok, out) = app.euglena(&["install", "palette", "--gene"]);
    assert!(ok, "reinstall failed:\n{out}");

    let (_, out) = app.euglena(&["doctor"]);
    assert!(
        out.contains("main.code: STALE"),
        "a moved pin should make the entry stale:\n{out}"
    );
    app.cleanup();
}

/// A gene edited in place after it was installed is refused rather than
/// quietly compiled in. An installed file nobody wrote is the one place a
/// change is invisible.
#[test]
fn a_gene_edited_in_place_is_refused() {
    let app = App::new("tamper");
    app.publish("palette", "9.9.9", PALETTE);
    assert!(app.euglena(&["install", "palette", "--gene"]).0);
    assert!(app.euglena(&["run"]).0);
    fs::write(
        app.installed("palette", "9.9.9"),
        "Palette =>\n    return Colours { bg = \"#ffffff\" }\n",
    )
    .unwrap();

    let (ok, out) = app.euglena(&["doctor"]);
    assert!(
        out.contains("does not match the sha256"),
        "a hand-edited gene should be refused:\n{out}"
    );
    assert!(
        !ok,
        "and doctor should fail rather than say everything checks out:\n{out}"
    );
    app.cleanup();
}

/// The registry serving bytes it did not publish a digest for is a refusal,
/// not a silent install.
#[test]
fn bytes_that_do_not_match_the_published_digest_are_refused() {
    let app = App::new("digest");
    app.publish("palette", "9.9.9", PALETTE);
    app.tamper_with_the_registry("palette", "Palette =>\n    return Something\n");

    let (ok, out) = app.euglena(&["install", "palette", "--gene"]);
    assert!(!ok, "a digest mismatch should fail:\n{out}");
    assert!(
        out.contains("does not match the sha256"),
        "and should say why:\n{out}"
    );
    assert!(
        !app.installed("palette", "9.9.9").exists(),
        "nothing should be left behind"
    );
    app.cleanup();
}

/// Declared but never fetched is a message naming the fix, not a failure
/// inside `code` about a file that does not exist.
#[test]
fn a_declared_but_uninstalled_gene_names_the_fix() {
    let app = App::new("missing");
    app.publish("palette", "9.9.9", PALETTE);
    assert!(app.euglena(&["install", "palette", "--gene"]).0);
    assert!(app.euglena(&["run"]).0);
    fs::remove_dir_all(app.root.join(".code").join("genes")).unwrap();

    let (ok, out) = app.euglena(&["doctor"]);
    assert!(!ok, "doctor should fail:\n{out}");
    assert!(
        out.contains("palette") && out.contains("euglena install"),
        "should name the gene and the fix:\n{out}"
    );
    app.cleanup();
}

/// A gene takes no alias: its handlers link into the root, which is what
/// makes it a gene rather than an organelle. Asking for one is a mistake
/// about what is being installed, so it is said rather than ignored.
#[test]
fn a_gene_refuses_an_alias() {
    let app = App::new("alias");
    app.publish("palette", "9.9.9", PALETTE);

    let (ok, out) = app.euglena(&["install", "palette", "--gene", "--as", "p"]);
    assert!(!ok, "an alias on a gene should fail:\n{out}");
    assert!(out.contains("a gene has no alias"), "got:\n{out}");
    app.cleanup();
}

/// Undeclaring a gene takes its bytes and its pin with it: nothing else can
/// be holding onto it, since the manifest naming it is the only thing that
/// puts it in the build.
#[test]
fn uninstalling_a_gene_undeclares_unpins_and_removes_it() {
    let app = App::new("uninstall");
    app.publish("palette", "9.9.9", PALETTE);
    assert!(app.euglena(&["install", "palette", "--gene"]).0);
    assert!(app.euglena(&["run"]).0);

    let (ok, out) = app.euglena(&["uninstall", "palette"]);
    assert!(ok, "uninstall failed:\n{out}");
    assert_eq!(app.manifest()["genes"], serde_json::json!([]));
    assert!(app.lock()["genes"].get("palette").is_none(), "still pinned");
    assert!(!app
        .root
        .join(".code")
        .join("genes")
        .join("palette")
        .exists());

    // And the entry stops linking it, rather than failing on a file that is gone.
    let (ok, out) = app.euglena(&["run"]);
    assert!(ok, "run after uninstall failed:\n{out}");
    assert!(
        !app.entry().contains("genes/palette"),
        "got:\n{}",
        app.entry()
    );
    app.cleanup();
}
