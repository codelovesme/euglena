//! euglena is a delegating CLI: what it adds is codegen and the cell model,
//! and everything else is `code`'s. These tests are about that seam — that
//! the delegation is visible under `-v`, that `test` is now `code test`
//! rather than a second copy of the same convention, and that an app can
//! raise the `code` version it needs above euglena's own baseline.

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;

fn bin() -> &'static str {
    env!("CARGO_BIN_EXE_euglena")
}

fn tmp_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("euglena_deleg_{}_{}", std::process::id(), tag));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

/// A `cdlvsm-code` reporting `version` that echoes the arguments it was
/// handed, so a test can assert on the command euglena actually delegated.
fn fake_code_on_path(dir: &Path, version: &str) -> PathBuf {
    let bindir = dir.join("bin");
    fs::create_dir_all(&bindir).unwrap();
    let shim = bindir.join("cdlvsm-code");
    fs::write(
        &shim,
        format!(
            "#!/bin/sh\nif [ \"$1\" = \"--version\" ]; then echo 'Code v{version}'; exit 0; fi\n\
             echo \"DELEGATED: $@\"\nexit 0\n"
        ),
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

fn scaffolded(tag: &str, code_version: &str) -> App {
    let work = tmp_dir(tag);
    let home = work.join("home");
    fs::create_dir_all(&home).unwrap();
    let path = fake_code_on_path(&work, code_version);

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
    }
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
        (
            out.status.success(),
            format!(
                "{}{}",
                String::from_utf8_lossy(&out.stdout),
                String::from_utf8_lossy(&out.stderr)
            ),
        )
    }

    /// Rewrite manifest.json with a `"code"` requirement. Written out in
    /// full rather than patched, so each test says exactly what the app
    /// declares.
    fn require_code(&self, requirement: &str) {
        fs::write(
            self.root.join("manifest.json"),
            format!(
                "{{\n  \"name\": \"demo\",\n  \"code\": \"{requirement}\",\n  \"organelles\": {{}}\n}}\n"
            ),
        )
        .unwrap();
    }

    fn cleanup(self) {
        let _ = fs::remove_dir_all(&self.work);
    }
}

/// `-v` answers "so what does this actually do?" — the generated entry, and
/// the exact `code` command it is handed to.
#[test]
fn verbose_shows_what_is_generated_and_what_is_delegated_to() {
    let app = scaffolded("verbose", "9.9.9-fake");

    let (ok, out) = app.euglena(&["run", "-v"]);
    assert!(ok, "got:\n{out}");
    assert!(
        out.contains("generated") && out.contains("main.code"),
        "should report the generated entry; got:\n{out}"
    );
    assert!(
        out.contains("1 gene") && out.contains("0 organelles"),
        "should count what landed in it; got:\n{out}"
    );
    assert!(
        out.contains("exec") && out.contains("cdlvsm-code") && out.contains(" run "),
        "should print the delegated command; got:\n{out}"
    );

    // Without -v it stays quiet: the app's own output is the output.
    let (ok, out) = app.euglena(&["run"]);
    assert!(ok, "got:\n{out}");
    assert!(
        !out.contains("exec"),
        "should be silent without -v; got:\n{out}"
    );

    app.cleanup();
}

/// `euglena test` is `code test` now — the `tests/` walk and the `fail_`
/// convention live in the language toolchain, not in a second copy here.
#[test]
fn test_delegates_to_code_test() {
    let app = scaffolded("test_deleg", "9.9.9-fake");

    let (ok, out) = app.euglena(&["test", "-v"]);
    assert!(ok, "got:\n{out}");
    assert!(
        out.contains("DELEGATED: test"),
        "euglena test should invoke `code test`; got:\n{out}"
    );
    // The entry is regenerated first, like run and build.
    assert!(app.root.join("main.code").is_file());

    app.cleanup();
}

/// euglena's baseline is what its *generated syntax* needs. What the *app*
/// needs is the app's to state, and it can only ever raise the bar.
#[test]
fn a_manifest_can_require_a_newer_code_than_euglenas_baseline() {
    // The `code` here satisfies euglena's own baseline, so if the run is
    // refused it can only be the manifest that refused it — which is the
    // whole point of the test.
    let app = scaffolded("manifest_req", "2.0.0");
    app.require_code(">=2.1.0");

    let (ok, out) = app.euglena(&["run"]);
    assert!(!ok, "v2.0.0 does not satisfy >=2.1.0; got:\n{out}");
    assert!(
        out.contains("2.1.0"),
        "should name what was asked for; got:\n{out}"
    );
    assert!(
        out.contains("manifest.json"),
        "should say the app asked, not euglena; got:\n{out}"
    );

    // A requirement below the baseline changes nothing — it cannot lower it.
    app.require_code("1.0.0");
    let (ok, out) = app.euglena(&["run"]);
    assert!(
        ok,
        "2.0.0 clears both the baseline and a 1.0.0 ask; got:\n{out}"
    );

    app.cleanup();
}

/// A requirement stated wrongly is not a requirement absent.
#[test]
fn a_malformed_code_requirement_is_an_error() {
    let app = scaffolded("bad_req", "9.9.9-fake");
    app.require_code("^1.1.6");

    let (ok, out) = app.euglena(&["run"]);
    assert!(!ok, "a caret range should be refused; got:\n{out}");
    assert!(
        out.contains("^1.1.6"),
        "should quote what it could not read; got:\n{out}"
    );

    app.cleanup();
}
