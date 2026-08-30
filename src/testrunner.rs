//! `euglena test` — runs every `tests/*.code` fixture, in place, through
//! `code run`. There is no `code test` subcommand to shell out to (v1.1.3's
//! commands are `init run build install remove ls format`), so this mirrors
//! the convention `code`'s own suite uses instead: a plain `foo.code` must
//! succeed, a `fail_foo.code` must fail.

use std::fs;
use std::path::Path;
use std::process::{self, Command};

pub fn run(project_root: &Path, binary: &str) {
    let tests_dir = project_root.join("tests");

    let mut fixtures: Vec<_> = match fs::read_dir(&tests_dir) {
        Ok(entries) => entries
            .flatten()
            .map(|e| e.path())
            .filter(|p| p.extension().map(|e| e == "code").unwrap_or(false) && p.is_file())
            .collect(),
        Err(_) => {
            println!("no tests/ directory in '{}'", project_root.display());
            return;
        }
    };
    fixtures.sort();

    if fixtures.is_empty() {
        println!("no *.code fixtures in '{}'", tests_dir.display());
        return;
    }

    let mut passed = 0;
    let mut failed = 0;

    for fixture in &fixtures {
        let file_name = fixture.file_name().expect("fixture has a file name");
        let name = file_name.to_string_lossy().to_string();
        let must_fail = name.starts_with("fail_");

        let status = Command::new(binary)
            .arg("run")
            .arg(file_name)
            .current_dir(&tests_dir)
            .status()
            .unwrap_or_else(|e| {
                eprintln!("euglena: failed to run '{}': {}", binary, e);
                process::exit(1);
            });

        let expected_success = !must_fail;
        if status.success() == expected_success {
            println!("ok    {name}");
            passed += 1;
        } else {
            println!("FAIL  {name}");
            failed += 1;
        }
    }

    println!();
    println!("{passed} passed, {failed} failed");
    if failed > 0 {
        process::exit(1);
    }
}
