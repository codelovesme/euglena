use std::path::Path;
use std::path::PathBuf;
use std::process;

use crate::codegen;

/// The minimum `code` version euglena generates valid syntax for. Everything
/// this crate emits — comment style, particle/handler syntax, `link`,
/// `.code/` project layout — targets this baseline; below it, generated
/// programs fail to parse. Recorded here once so the check and its error
/// text can never drift from each other.
pub(crate) const MIN_CODE_VERSION: (u32, u32, u32) = (1, 1, 0);

pub(crate) fn fmt_version((major, minor, patch): (u32, u32, u32)) -> String {
    format!("{major}.{minor}.{patch}")
}

/// Run a project (or a bare `.code` file/directory with no manifest) through
/// `code run`.
pub fn run(path: &str) {
    let binary = find_code_binary_or_exit();
    let entry_arg = resolve_entry_arg(path);

    let status = process::Command::new(&binary)
        .arg("run")
        .arg(&entry_arg)
        .status();
    exit_on_status(&binary, status);
}

/// Compile a project (or a bare `.code` file/directory) through `code build`.
pub fn build(path: &str, release: bool, target: Option<&str>, output: Option<&str>) {
    let binary = find_code_binary_or_exit();
    let entry_arg = resolve_entry_arg(path);

    let mut cmd = process::Command::new(&binary);
    cmd.arg("build").arg(&entry_arg);
    cmd.args(["--target", target.unwrap_or("exe")]);
    if release {
        cmd.arg("--release");
    }
    if let Some(o) = output {
        cmd.args(["--output", o]);
    }

    let status = cmd.status();
    exit_on_status(&binary, status);
}

/// `code format`, defaulting to `src/` and `tests/` when no paths are given.
pub fn format(check: bool, paths: &[String]) {
    let binary = find_code_binary_or_exit();

    let mut cmd = process::Command::new(&binary);
    cmd.arg("format");
    if check {
        cmd.arg("--check");
    }
    cmd.args(paths);

    let status = cmd.status();
    exit_on_status(&binary, status);
}

fn exit_on_status(binary: &str, status: std::io::Result<process::ExitStatus>) {
    let status = status.unwrap_or_else(|e| {
        eprintln!("euglena: failed to run '{}': {}", binary, e);
        eprintln!("If this path is wrong, update it with:");
        eprintln!(
            "  {} code set /absolute/path/to/code",
            crate::invocation::command_prefix()
        );
        process::exit(1);
    });
    if !status.success() {
        process::exit(status.code().unwrap_or(1));
    }
}

/// Resolve the `run`/`build` positional argument to what actually gets
/// handed to `code`. A manifest.json makes this an euglena app: the entry is
/// (re)generated at the project root (see `codegen::write_main_code`) and
/// that root directory is what's passed — `code`'s own "a directory means
/// its main.code" convention does the rest, and installed organelles resolve
/// natively since the entry now lives where `.code/` actually is.
///
/// With no manifest.json, `path` is passed straight through: a bare `.code`
/// file or a plain (non-euglena) `code` project.
fn resolve_entry_arg(path: &str) -> String {
    let project_root = project_root_from_path(path);
    if project_root.join("manifest.json").is_file() {
        if let Err(e) = codegen::write_main_code(&project_root) {
            eprintln!("euglena: failed to generate main.code: {}", e);
            process::exit(1);
        }
        project_root.to_string_lossy().to_string()
    } else {
        path.to_string()
    }
}

/// The project root a `run`/`build` path argument implies: the path itself
/// when it names a directory, or its parent when it names a file.
pub(crate) fn project_root_from_path(path: &str) -> PathBuf {
    let p = Path::new(path);
    let base = if p.is_dir() {
        p.to_path_buf()
    } else {
        p.parent().unwrap_or(Path::new(".")).to_path_buf()
    };
    std::fs::canonicalize(&base).unwrap_or(base)
}

pub(crate) fn find_code_binary_or_exit() -> String {
    // 1. An explicitly configured path always wins (dev builds, custom
    //    locations) — `euglena code set` is the override, not a requirement.
    //    Still version-checked: a stale configured binary should fail here,
    //    by name, rather than as a parse error partway through a generated
    //    file.
    if let Some(path) = crate::config::read_code_binary_path() {
        match code_interpreter_version(&path) {
            Some(v) if v >= MIN_CODE_VERSION => return path.to_string_lossy().to_string(),
            Some(v) => {
                eprintln!(
                    "euglena: configured Code interpreter '{}' is v{}, but euglena requires >= v{}.",
                    path.display(),
                    fmt_version(v),
                    fmt_version(MIN_CODE_VERSION)
                );
                eprintln!("Install a newer one, then re-point euglena if the path changed:");
                eprintln!("  cdlvsm install code");
                eprintln!(
                    "  {} code set /absolute/path/to/code",
                    crate::invocation::command_prefix()
                );
                process::exit(1);
            }
            None => {
                eprintln!(
                    "euglena: configured path '{}' does not look like a Code interpreter (failed `--version`)",
                    path.display()
                );
                process::exit(1);
            }
        }
    }

    // 2. Otherwise discover cdlvsm's `cdlvsm-code` shim on PATH, so the common
    //    flow (`cdlvsm install code && cdlvsm install euglena`) needs no manual
    //    wiring — both land in a PATH dir like ~/.local/bin.
    match discover_cdlvsm_code_on_path() {
        Some(CodeDiscovery::Ready(path)) => return path,
        Some(CodeDiscovery::TooOld { path, version }) => {
            eprintln!(
                "euglena: found Code v{} at '{}', but euglena requires >= v{}.",
                fmt_version(version),
                path,
                fmt_version(MIN_CODE_VERSION)
            );
            eprintln!("Upgrade it:");
            eprintln!("  cdlvsm install code");
            process::exit(1);
        }
        None => {}
    }

    eprintln!("euglena: no Code interpreter found.");
    eprintln!("Install one via cdlvsm so `cdlvsm-code` is on your PATH:");
    eprintln!("  cdlvsm install code");
    eprintln!("or point euglena at a specific `code` binary:");
    eprintln!(
        "  {} code set /absolute/path/to/code",
        crate::invocation::command_prefix()
    );
    process::exit(1);
}

pub(crate) enum CodeDiscovery {
    Ready(String),
    TooOld {
        path: String,
        version: (u32, u32, u32),
    },
}

/// Search PATH for cdlvsm's `cdlvsm-code` shim — and ONLY that name.
///
/// Deliberately NOT a bare `code`: on Linux `code` is VS Code's own CLI, and
/// euglena must never risk invoking (or even running `--version` on) that. A
/// `code` binary installed some other way is supported via an explicit
/// `euglena code set`.
pub(crate) fn discover_cdlvsm_code_on_path() -> Option<CodeDiscovery> {
    let path_var = std::env::var_os("PATH")?;
    for dir in std::env::split_paths(&path_var) {
        let candidate = dir.join("cdlvsm-code");
        if let Some(version) = code_interpreter_version(&candidate) {
            let path_str = candidate.to_string_lossy().to_string();
            return Some(if version >= MIN_CODE_VERSION {
                CodeDiscovery::Ready(path_str)
            } else {
                CodeDiscovery::TooOld {
                    path: path_str,
                    version,
                }
            });
        }
    }
    None
}

/// `path`'s reported version, if it runs and identifies itself as the Code
/// interpreter (`Code vX.Y.Z`) — a guard against a broken/dangling shim, or
/// something else entirely, resolving to that name. `None` either way means
/// "not usable as the interpreter", never "usable but ancient" — version
/// comparison is the caller's job.
pub(crate) fn code_interpreter_version(path: &Path) -> Option<(u32, u32, u32)> {
    if !path.is_file() {
        return None;
    }
    let out = process::Command::new(path).arg("--version").output().ok()?;
    if !out.status.success() {
        return None;
    }
    parse_code_version(&String::from_utf8_lossy(&out.stdout))
}

/// Parse a `Code vX.Y.Z…` line into `(X, Y, Z)`. Trailing non-digit text
/// after the patch number (a prerelease/build suffix) is tolerated and
/// ignored, so `Code v9.9.9-fake` still parses as `(9, 9, 9)`.
fn parse_code_version(s: &str) -> Option<(u32, u32, u32)> {
    let first_line = s.lines().next()?;
    let rest = first_line.strip_prefix("Code v")?;
    let mut parts = rest.splitn(3, '.');
    let major: u32 = parts.next()?.parse().ok()?;
    let minor: u32 = parts.next()?.parse().ok()?;
    let patch = match parts.next() {
        Some(field) => {
            let digits: String = field.chars().take_while(|c| c.is_ascii_digit()).collect();
            if digits.is_empty() {
                0
            } else {
                digits.parse().ok()?
            }
        }
        None => 0,
    };
    Some((major, minor, patch))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_plain_version() {
        assert_eq!(parse_code_version("Code v1.1.3"), Some((1, 1, 3)));
    }

    #[test]
    fn parses_version_with_suffix() {
        assert_eq!(parse_code_version("Code v9.9.9-fake"), Some((9, 9, 9)));
    }

    #[test]
    fn parses_version_with_no_patch() {
        assert_eq!(parse_code_version("Code v1.1"), Some((1, 1, 0)));
    }

    #[test]
    fn rejects_non_code_output() {
        assert_eq!(parse_code_version("1.99.0"), None);
        assert_eq!(parse_code_version(""), None);
    }

    #[test]
    fn min_version_ordering() {
        assert!((1, 1, 3) >= MIN_CODE_VERSION);
        assert!((0, 4, 1) < MIN_CODE_VERSION);
        assert!((1, 0, 99) < MIN_CODE_VERSION);
    }
}
