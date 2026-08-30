//! Integration tests for `euglena init` scaffolding and the generated entry
//! (T7, T8, T9).
//!
//! The hermetic tests run everywhere (CI included). The real-run test is gated
//! behind `EUGLENA_TEST_CODE_BIN=/path/to/code` — the only way to *truly*
//! verify the scaffolded template is valid Code is to run it through a real
//! `code` interpreter, which CI doesn't have.

use std::fs;
use std::path::PathBuf;
use std::process::Command;

fn bin() -> &'static str {
    env!("CARGO_BIN_EXE_euglena")
}

fn tmp_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("euglena_it_{}_{}", std::process::id(), tag));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

/// `euglena init` writes a `.code/` marker, an empty lockfile, a `.gitignore`,
/// manifest.json, a nucleus gene, and a starter test fixture — and nothing
/// else. Getting the `.code/` marker right is what makes an `add` inside the
/// scaffolded app resolve against *this* project rather than some ancestor.
#[test]
fn init_scaffolds_a_code_project() {
    let work = tmp_dir("scaffold_layout");
    let status = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .status()
        .unwrap();
    assert!(status.success(), "euglena init failed");

    let root = work.join("demo");
    assert!(root.join("manifest.json").is_file());
    assert!(root.join("src/nucleus.gene.code").is_file());
    assert!(root.join(".code").is_dir());
    assert!(root.join(".code/lock.json").is_file());
    assert!(root.join(".gitignore").is_file());
    assert!(root.join("tests").is_dir());

    let lock = fs::read_to_string(root.join(".code/lock.json")).unwrap();
    assert!(lock.contains("\"modules\""));

    let gitignore = fs::read_to_string(root.join(".gitignore")).unwrap();
    assert!(gitignore.contains("main.code"));
    assert!(gitignore.contains("build/"));

    // main.code is generated on first run, not written by init.
    assert!(!root.join("main.code").exists());

    let _ = fs::remove_dir_all(&work);
}

/// A second `init` into the same directory refuses and writes nothing new.
#[test]
fn init_refuses_an_existing_directory() {
    let work = tmp_dir("scaffold_refuse");
    let first = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .status()
        .unwrap();
    assert!(first.success());

    let second = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .status()
        .unwrap();
    assert!(!second.success(), "second init should refuse");

    let _ = fs::remove_dir_all(&work);
}

/// `euglena init` scaffolds a nucleus gene in current Code syntax: `--`
/// comments, a handler with a field list, `let` for every first binding —
/// not the removed `->` comment marker, `Particle ∩ { … }` schema (that
/// belongs to the archived language in `code/old/`), or a bare assignment
/// standing in for a first binding. Getting this wrong is what made
/// `euglena init` -> `euglena run` fail against current `code` (see T2, T3,
/// and now T7 for the v1.1.3 migration).
#[test]
fn scaffolded_nucleus_uses_current_syntax() {
    let work = tmp_dir("nucleus_syntax");
    let status = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .status()
        .unwrap();
    assert!(status.success(), "euglena init failed");

    let gene = fs::read_to_string(work.join("demo/src/nucleus.gene.code")).unwrap();

    assert!(
        gene.contains("--") && !gene.contains("->"),
        "nucleus gene should use `--` comments, not `->`; got:\n{gene}"
    );
    assert!(
        gene.contains("EuglenaHasBeenBorn { cell_name } =>"),
        "handler needs a field list (no schema declarations any more); got:\n{gene}"
    );
    assert!(
        !gene.contains("Particle") && !gene.contains('∩'),
        "must not use the archived language's Particle-schema syntax; got:\n{gene}"
    );
    assert!(
        !gene.contains("type EuglenaHasBeenBorn"),
        "must not use the removed `type` keyword; got:\n{gene}"
    );

    let _ = fs::remove_dir_all(&work);
}

/// Full end-to-end: scaffold a project and actually run it through a real
/// `code` interpreter. Gated on `EUGLENA_TEST_CODE_BIN` since CI has no `code`.
#[test]
fn scaffolded_app_runs_against_real_code() {
    let code_bin = match std::env::var("EUGLENA_TEST_CODE_BIN") {
        Ok(p) if !p.is_empty() => p,
        _ => {
            eprintln!("skipping: set EUGLENA_TEST_CODE_BIN=/path/to/code to run");
            return;
        }
    };

    let work = tmp_dir("real_run");

    // Point euglena at the code binary. `euglena code set` writes to
    // ~/.config/euglena-cli — isolate it via a temp HOME so the test doesn't
    // clobber the developer's real config.
    let home = work.join("home");
    fs::create_dir_all(&home).unwrap();

    let set = Command::new(bin())
        .args(["code", "set", &code_bin])
        .env("HOME", &home)
        .status()
        .unwrap();
    assert!(set.success(), "euglena code set failed");

    let init = Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .env("HOME", &home)
        .status()
        .unwrap();
    assert!(init.success(), "euglena init failed");

    let run = Command::new(bin())
        .arg("run")
        .current_dir(work.join("demo"))
        .env("HOME", &home)
        .output()
        .unwrap();
    assert!(
        run.status.success(),
        "euglena run failed:\nstdout: {}\nstderr: {}",
        String::from_utf8_lossy(&run.stdout),
        String::from_utf8_lossy(&run.stderr),
    );

    // The generated entry landed at the project root, not a temp directory
    // (T9), and carries the GENERATED marker.
    let entry = work.join("demo/main.code");
    assert!(
        entry.is_file(),
        "main.code should be generated at the project root"
    );
    let content = fs::read_to_string(&entry).unwrap();
    assert!(content.starts_with("-- GENERATED"));

    // euglena test runs the starter fixture too.
    let test = Command::new(bin())
        .arg("test")
        .current_dir(work.join("demo"))
        .env("HOME", &home)
        .output()
        .unwrap();
    assert!(
        test.status.success(),
        "euglena test failed:\nstdout: {}\nstderr: {}",
        String::from_utf8_lossy(&test.stdout),
        String::from_utf8_lossy(&test.stderr),
    );

    let _ = fs::remove_dir_all(&work);
}

/// T9: euglena refuses to overwrite a hand-written `main.code` — only one it
/// generated itself (marked with the GENERATED header) is fair game.
#[test]
fn refuses_to_overwrite_a_hand_written_main_code() {
    let code_bin = match std::env::var("EUGLENA_TEST_CODE_BIN") {
        Ok(p) if !p.is_empty() => p,
        _ => {
            eprintln!("skipping: set EUGLENA_TEST_CODE_BIN=/path/to/code to run");
            return;
        }
    };

    let work = tmp_dir("refuse_overwrite");
    let home = work.join("home");
    fs::create_dir_all(&home).unwrap();

    Command::new(bin())
        .args(["code", "set", &code_bin])
        .env("HOME", &home)
        .status()
        .unwrap();
    Command::new(bin())
        .args(["init", "demo"])
        .current_dir(&work)
        .env("HOME", &home)
        .status()
        .unwrap();

    let project = work.join("demo");
    fs::write(project.join("main.code"), "-- hand-written\nassert 1 = 1\n").unwrap();

    let run = Command::new(bin())
        .arg("run")
        .current_dir(&project)
        .env("HOME", &home)
        .output()
        .unwrap();
    assert!(!run.status.success(), "should refuse to overwrite");
    let stderr = String::from_utf8_lossy(&run.stderr);
    assert!(
        stderr.contains("already exists"),
        "should explain the refusal; got:\n{stderr}"
    );

    let _ = fs::remove_dir_all(&work);
}
