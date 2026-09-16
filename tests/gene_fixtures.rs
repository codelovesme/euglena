//! The genes this repository ships are `.code`, and the ones with logic in
//! them carry a fixture in `genes/tests/`. Run them under the real
//! interpreter when one is there (`EUGLENA_TEST_CODE_BIN`, as CI sets it),
//! otherwise under a `cdlvsm-code` on PATH; skipped without either.

use std::path::PathBuf;
use std::process::Command;

fn interpreter() -> Option<PathBuf> {
    if let Ok(p) = std::env::var("EUGLENA_TEST_CODE_BIN") {
        let p = PathBuf::from(p);
        if p.exists() {
            return Some(p);
        }
    }
    let found = Command::new("cdlvsm-code").arg("--version").output().ok()?;
    if found.status.success() {
        return Some(PathBuf::from("cdlvsm-code"));
    }
    None
}

#[test]
fn every_gene_fixture_passes() {
    let Some(code) = interpreter() else {
        eprintln!("skipped: no code interpreter");
        return;
    };
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("genes/tests");
    let mut ran = 0;
    for entry in std::fs::read_dir(&dir).expect("genes/tests exists") {
        let path = entry.unwrap().path();
        if path.extension().and_then(|e| e.to_str()) != Some("code") {
            continue;
        }
        let out = Command::new(&code)
            .arg("run")
            .arg(path.file_name().unwrap())
            .current_dir(&dir)
            .output()
            .expect("run the fixture");
        assert!(
            out.status.success(),
            "{} failed:\n{}{}",
            path.display(),
            String::from_utf8_lossy(&out.stdout),
            String::from_utf8_lossy(&out.stderr)
        );
        ran += 1;
    }
    assert!(ran > 0, "no fixtures found in genes/tests");
}
