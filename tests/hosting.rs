use std::{fs, process::Command};

#[test]
fn doctor_and_wasm_build_refuse_a_missing_guest_module_before_generation() {
    let root = std::env::temp_dir().join(format!("euglena-hosting-cli-{}", std::process::id()));
    let _ = fs::remove_dir_all(&root);
    fs::create_dir_all(root.join("guest")).unwrap();
    fs::write(
        root.join("manifest.json"),
        r#"{"name":"shell","runtime":"web","guests":["guest"],"organelles":{}}"#,
    )
    .unwrap();
    fs::write(
        root.join("guest/manifest.json"),
        r#"{"name":"auth-web","runtime":"web","organelles":{"clock":"timer"}}"#,
    )
    .unwrap();
    for args in [vec!["doctor"], vec!["build", "--target", "wasm"]] {
        let output = Command::new(env!("CARGO_BIN_EXE_euglena"))
            .args(args)
            .current_dir(&root)
            .output()
            .unwrap();
        assert!(!output.status.success());
        let text = format!(
            "{}{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
        for word in ["auth-web", "clock", "timer"] {
            assert!(text.contains(word), "{text}");
        }
        assert!(!root.join("main.code").exists());
    }
    fs::remove_dir_all(root).unwrap();
}
