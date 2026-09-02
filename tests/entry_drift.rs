//! `main.code` is generated and gitignored, so the question a user cannot
//! answer by looking at it is whether it still matches what generated it.
//! These tests cover the three answers `euglena doctor` gives: up to date,
//! stale (the next run/build/test fixes it), and edited by hand (the next
//! run/build/test destroys it).

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;

fn bin() -> &'static str {
    env!("CARGO_BIN_EXE_euglena")
}

fn tmp_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("euglena_drift_{}_{}", std::process::id(), tag));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

/// A `cdlvsm-code` that satisfies the version check and does nothing else —
/// enough for `euglena run` to reach codegen and write a real `main.code`,
/// without CI needing a real interpreter.
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
    bindir
}

struct App {
    work: PathBuf,
    root: PathBuf,
    home: PathBuf,
    path: PathBuf,
}

/// Scaffold an app and generate its entry once, so every test starts from a
/// `main.code` that is genuinely up to date.
fn scaffolded(tag: &str) -> App {
    let work = tmp_dir(tag);
    let home = work.join("home");
    fs::create_dir_all(&home).unwrap();
    let path = fake_code_on_path(&work);

    let init = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .env("HOME", &home)
        .status()
        .unwrap();
    assert!(init.success(), "euglena init failed");

    let app = App {
        root: work.join("demo"),
        work,
        home,
        path,
    };
    let (ok, out) = app.euglena(&["run"]);
    assert!(ok, "euglena run should generate main.code; got:\n{out}");
    assert!(app.root.join("main.code").is_file());
    app
}

impl App {
    fn euglena(&self, args: &[&str]) -> (bool, String) {
        let out = Command::new(bin())
            .args(args)
            .current_dir(&self.root)
            .env("HOME", &self.home)
            .env("PATH", &self.path)
            .output()
            .unwrap();
        let combined = format!(
            "{}{}",
            String::from_utf8_lossy(&out.stdout),
            String::from_utf8_lossy(&out.stderr)
        );
        (out.status.success(), combined)
    }

    fn entry(&self) -> String {
        fs::read_to_string(self.root.join("main.code")).unwrap()
    }

    fn cleanup(self) {
        let _ = fs::remove_dir_all(&self.work);
    }
}

/// The stamp is what makes the other two states knowable: a generated entry
/// records the euglena that wrote it and the digest of its own body.
#[test]
fn a_generated_entry_carries_a_stamp() {
    let app = scaffolded("stamped");
    let lines: Vec<String> = app.entry().lines().map(str::to_string).collect();

    assert!(lines[0].starts_with("-- GENERATED"), "got:\n{:?}", lines[0]);
    assert!(
        lines[1].starts_with("-- euglena ") && lines[1].contains("sha256:"),
        "second line should be the stamp; got:\n{:?}",
        lines[1]
    );
    app.cleanup();
}

#[test]
fn doctor_says_up_to_date_right_after_a_run() {
    let app = scaffolded("fresh");
    let (ok, out) = app.euglena(&["doctor"]);
    assert!(
        ok,
        "doctor should pass on a freshly generated app; got:\n{out}"
    );
    assert!(out.contains("main.code: up to date"), "got:\n{out}");
    app.cleanup();
}

/// Changing an input without re-running leaves `main.code` behind — the exact
/// state in which a plain `code run .` quietly executes the old entry.
#[test]
fn doctor_reports_a_stale_entry_and_names_the_fix() {
    let app = scaffolded("stale");
    fs::write(
        app.root.join("src/extra.gene.code"),
        "export let gene_name = \"extra\"\n",
    )
    .unwrap();

    let (ok, out) = app.euglena(&["doctor"]);
    assert!(
        out.contains("main.code: STALE"),
        "a new gene should make the entry stale; got:\n{out}"
    );
    assert!(
        out.contains("run"),
        "should name the command that regenerates it; got:\n{out}"
    );
    assert!(
        ok,
        "stale is the normal state between an edit and the next run, not a failure; got:\n{out}"
    );

    // ...and running again clears it.
    let (_, _) = app.euglena(&["run"]);
    let (ok, out) = app.euglena(&["doctor"]);
    assert!(ok, "got:\n{out}");
    assert!(out.contains("main.code: up to date"), "got:\n{out}");
    app.cleanup();
}

/// The state the GENERATED header alone could never catch, and the only one
/// worth failing the checkup over: edits that the next run silently eats.
#[test]
fn doctor_fails_on_an_entry_edited_after_generation() {
    let app = scaffolded("edited");
    let text = app.entry();
    fs::write(app.root.join("main.code"), format!("{text}assert 1 = 1\n")).unwrap();

    let (ok, out) = app.euglena(&["doctor"]);
    assert!(
        out.contains("main.code: EDITED BY HAND"),
        "an edited body no longer matches its stamp; got:\n{out}"
    );
    assert!(!ok, "an edit that will be destroyed should fail doctor");
    app.cleanup();
}

/// A `main.code` that was never euglena's stays the user's: reported as
/// hand-written, not as an edit of ours.
#[test]
fn doctor_leaves_a_hand_written_entry_alone() {
    let app = scaffolded("hand_written");
    fs::write(app.root.join("main.code"), "-- mine\nassert 1 = 1\n").unwrap();

    let (_, out) = app.euglena(&["doctor"]);
    assert!(out.contains("main.code: hand-written"), "got:\n{out}");
    app.cleanup();
}
