use std::path::Path;
use std::path::PathBuf;
use std::process;

use crate::codegen;

/// The minimum `code` version euglena generates valid syntax for. Everything
/// this crate emits — comment style, particle/handler syntax, `link`,
/// `.code/` project layout — targets this baseline; below it, generated
/// programs fail to parse. Recorded here once so the check and its error
/// text can never drift from each other.
///
/// The syntax reason is 1.4.0: that is where the comment marker became `|`,
/// and every file euglena generates opens with a `| GENERATED` header and a
/// `| euglena …` stamp, so on any older `code` the entry does not parse at
/// all.
///
/// It says 1.8.0, because a manifest may now name a hosted stand-in
/// (`"hosted": "membrane"`), and the entry generated for one asks the runtime
/// `Linked` and then links a door from inside a handler. Both landed by
/// 1.7.2 — but under names the language has since dropped, along with the
/// borrowed word "organelle". 1.8.0 is the first `code` that speaks the
/// entry euglena writes.
/// Only apps that use a stand-in generate that code, so this is a baseline
/// raised for a feature most apps will not touch. One number is still the
/// right shape: a second, feature-scoped floor would have to be checked at
/// codegen and reported somewhere else, for a saving nobody is asking for
/// while the earlier baseline has no users left on it.
///
/// The number before it was 1.5.1, because **1.4.0 was tagged and never published** —
/// no binary was ever built for it, so nobody can install the version this
/// used to claim to support. A minimum nobody can obtain is not a
/// compatibility promise, it is a number; and CI could not test against it
/// either, which is how it went unnoticed that the pin there had been left
/// three minor versions behind. Raised to the oldest `code` a person can
/// actually download, which is also the one CI now runs against — the claim
/// and the check say the same thing again.
///
/// Cheap to do because nobody is on an earlier euglena to be cut off. If
/// that stops being true, the honest move is a published binary at whatever
/// the baseline is, not a lower number.
///
/// This baseline swallowed the two per-command floors that used to sit here
/// — 1.2.0 for `code test`, 1.3.0 for `code uninstall`. Both are below it,
/// so no `code` can satisfy the baseline and still be too old for either
/// command: the floors could not fire, and a floor that cannot fire is a
/// claim nothing checks. The *mechanism* stays (`version_need` still takes a
/// `command_floor`), for the next subcommand that lands ahead of whatever
/// the baseline is then.
pub(crate) const MIN_CODE_VERSION: (u32, u32, u32) = (1, 8, 0);

pub(crate) fn fmt_version((major, minor, patch): (u32, u32, u32)) -> String {
    format!("{major}.{minor}.{patch}")
}

/// A `code` version some invocation needs, and what asked for it.
///
/// Three things can raise the bar and they fail for different reasons, so an
/// error that only said "need >= x.y.z" would send the reader to the wrong
/// place: euglena's baseline is about the *syntax it generates*, a command
/// floor is about a subcommand that did not exist yet, and a manifest
/// requirement is about what the *app itself* uses.
pub(crate) struct VersionNeed {
    pub version: (u32, u32, u32),
    /// A clause completing "…, which <reason>" — kept short so the error
    /// reads as a sentence.
    pub reason: String,
}

impl VersionNeed {
    fn baseline() -> Self {
        VersionNeed {
            version: MIN_CODE_VERSION,
            reason: "is the syntax euglena generates".to_string(),
        }
    }

    /// Raise this need if `candidate` is higher. The highest bar wins, and it
    /// keeps its own explanation.
    fn raise(self, candidate: Option<(u32, u32, u32)>, reason: &str) -> Self {
        match candidate {
            Some(v) if v > self.version => VersionNeed {
                version: v,
                reason: reason.to_string(),
            },
            _ => self,
        }
    }
}

/// What version this invocation needs: euglena's baseline, raised by a
/// command floor (`code test`) and by the app's own `"code"` requirement.
///
/// A malformed `"code"` field is an error rather than a shrug — an app that
/// states a requirement wrongly is not an app with no requirement.
pub(crate) fn version_need(
    project_root: Option<&Path>,
    command_floor: Option<((u32, u32, u32), &str)>,
) -> Result<VersionNeed, String> {
    let mut need = VersionNeed::baseline();
    if let Some((floor, reason)) = command_floor {
        need = need.raise(Some(floor), reason);
    }
    let Some(root) = project_root else {
        return Ok(need);
    };
    let required = crate::manifest::read_code_requirement(&root.join("manifest.json"))?;
    Ok(need.raise(required, "is what this app's manifest.json asks for"))
}

/// [`version_need`], for the commands that have nothing useful to do with a
/// malformed manifest but stop.
fn version_need_or_exit(
    project_root: Option<&Path>,
    command_floor: Option<((u32, u32, u32), &str)>,
) -> VersionNeed {
    version_need(project_root, command_floor).unwrap_or_else(|e| {
        eprintln!("euglena: {e}");
        process::exit(1);
    })
}

/// Run a Euglena app through `code run`, regenerating its entry first.
pub fn run(path: &str, verbose: bool) {
    let project_root = euglena_project_root_or_exit(path);
    let need = version_need_or_exit(Some(&project_root), None);
    let binary = find_code_binary_or_exit(&need);
    let entry_arg = generate_entry_or_exit(&project_root, verbose);

    let mut cmd = process::Command::new(&binary);
    cmd.arg("run").arg(&entry_arg);
    trace(verbose, &binary, &cmd);
    exit_on_status(&binary, cmd.status());
}

/// Compile a Euglena app through `code build`, regenerating its entry first.
pub fn build(path: &str, release: bool, target: Option<&str>, output: Option<&str>, verbose: bool) {
    let project_root = euglena_project_root_or_exit(path);
    let need = version_need_or_exit(Some(&project_root), None);
    let binary = find_code_binary_or_exit(&need);
    let entry_arg = generate_entry_or_exit(&project_root, verbose);

    let mut cmd = process::Command::new(&binary);
    cmd.arg("build").arg(&entry_arg);
    cmd.args(["--target", target.unwrap_or("exe")]);
    if release {
        cmd.arg("--release");
    }
    if let Some(o) = output {
        cmd.args(["--output", o]);
    }

    trace(verbose, &binary, &cmd);
    exit_on_status(&binary, cmd.status());
}

/// `euglena test` — regenerate the entry, then hand the fixtures to `code
/// test`.
///
/// The runner is `code`'s. Walking `tests/`, the `fail_` prefix convention
/// and interpreting a fixture are all the language toolchain's job and have
/// nothing to do with cells; euglena kept its own copy only because `code`
/// had no `test` command yet, and two copies of one convention is two things
/// that can disagree.
pub fn test(path: &str, verbose: bool) {
    let project_root = euglena_project_root_or_exit(path);
    let need = version_need_or_exit(Some(&project_root), None);
    let binary = find_code_binary_or_exit(&need);
    generate_entry_or_exit(&project_root, verbose);

    let mut cmd = process::Command::new(&binary);
    cmd.arg("test").current_dir(&project_root);
    trace(verbose, &binary, &cmd);
    exit_on_status(&binary, cmd.status());
}

/// A `code` at euglena's own baseline — for the commands that touch the
/// toolchain without running an app (`install`, `uninstall`, `format`).
pub(crate) fn baseline_code_binary_or_exit() -> String {
    find_code_binary_or_exit(&version_need_or_exit(None, None))
}

/// `code format`, defaulting to `src/` and `tests/` when no paths are given.
pub fn format(check: bool, paths: &[String]) {
    let binary = find_code_binary_or_exit(&version_need_or_exit(None, None));

    let mut cmd = process::Command::new(&binary);
    cmd.arg("format");
    if check {
        cmd.arg("--check");
    }
    cmd.args(paths);

    let status = cmd.status();
    exit_on_status(&binary, status);
}

/// Under `-v`, print the `code` invocation about to run.
///
/// euglena's whole job is delegation, and a wrapper that never shows what it
/// delegates to is a wrapper you cannot learn the underlying tool from. This
/// turns `euglena run -v` into the answer to "so what does this actually do?"
fn trace(verbose: bool, binary: &str, cmd: &process::Command) {
    if !verbose {
        return;
    }
    let args: Vec<String> = cmd
        .get_args()
        .map(|a| a.to_string_lossy().into_owned())
        .collect();
    eprintln!("euglena: exec {} {}", binary, args.join(" "));
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

/// The Euglena project root a `run`/`build` path argument names — or exit.
///
/// A manifest.json is **required**. euglena runs and builds cells; the one
/// thing it adds over `code` is generating an entry from `manifest.json` plus
/// `src/*.gene.code`, and with no manifest there is nothing to generate and
/// nothing euglena contributes. It used to hand such a path straight to
/// `code`, which made `euglena run` a second name for `code run` on some
/// inputs but not others — the layer boundary is worth more than that
/// convenience, so this stops and names the right tool instead.
///
/// Checked before the interpreter is located, so a directory that was never a
/// Euglena app is told *that*, rather than being sent to install a `code` it
/// would have no use for.
fn euglena_project_root_or_exit(path: &str) -> PathBuf {
    let project_root = project_root_from_path(path);
    if project_root.join("manifest.json").is_file() {
        return project_root;
    }

    eprintln!(
        "euglena: '{}' is not a Euglena app — no manifest.json in {}.",
        path,
        project_root.display()
    );
    eprintln!();
    eprintln!("euglena runs and builds cells: manifest.json + src/*.gene.code.");
    eprintln!("For a plain code project or a lone .code file, use code directly:");
    eprintln!("  cdlvsm code run {path}");
    eprintln!(
        "To make this directory a Euglena app: {} init <name>",
        crate::invocation::command_prefix()
    );
    process::exit(1);
}

/// Regenerate the app's `main.code` and return what to hand `code`: the
/// project root itself. `code`'s own "a directory means its main.code"
/// convention does the rest, and installed organelles resolve natively since
/// the entry lives where `.code/` actually is.
fn generate_entry_or_exit(project_root: &Path, verbose: bool) -> String {
    match codegen::write_main_code(project_root) {
        Ok(summary) => {
            if verbose {
                eprintln!(
                    "euglena: generated {}/main.code ({}, {})",
                    project_root.display(),
                    plural(summary.genes, "gene"),
                    plural(summary.organelles, "organelle"),
                );
            }
        }
        Err(e) => {
            eprintln!("euglena: failed to generate main.code: {}", e);
            process::exit(1);
        }
    }
    project_root.to_string_lossy().to_string()
}

fn plural(n: usize, noun: &str) -> String {
    if n == 1 {
        format!("1 {noun}")
    } else {
        format!("{n} {noun}s")
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

/// Locate a usable `code`, or explain why the one that is there is not.
///
/// `need` carries both the bar and the reason it is that high, so "upgrade
/// `code`" and "your manifest asks for more than you have installed" do not
/// arrive as the same sentence.
pub(crate) fn find_code_binary_or_exit(need: &VersionNeed) -> String {
    // 1. An explicitly configured path always wins (dev builds, custom
    //    locations) — `euglena code set` is the override, not a requirement.
    //    Still version-checked: a stale configured binary should fail here,
    //    by name, rather than as a parse error partway through a generated
    //    file.
    if let Some(path) = crate::config::read_code_binary_path() {
        match code_interpreter_version(&path) {
            Some(v) if v >= need.version => return path.to_string_lossy().to_string(),
            Some(v) => {
                eprintln!(
                    "euglena: configured Code interpreter '{}' is v{}, but this needs >= v{}, which {}.",
                    path.display(),
                    fmt_version(v),
                    fmt_version(need.version),
                    need.reason
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
    match discover_cdlvsm_code_on_path(need.version) {
        Some(CodeDiscovery::Ready(path)) => return path,
        Some(CodeDiscovery::TooOld { path, version }) => {
            eprintln!(
                "euglena: found Code v{} at '{}', but this needs >= v{}, which {}.",
                fmt_version(version),
                path,
                fmt_version(need.version),
                need.reason
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
pub(crate) fn discover_cdlvsm_code_on_path(min: (u32, u32, u32)) -> Option<CodeDiscovery> {
    let path_var = std::env::var_os("PATH")?;
    for dir in std::env::split_paths(&path_var) {
        let candidate = dir.join("cdlvsm-code");
        if let Some(version) = code_interpreter_version(&candidate) {
            let path_str = candidate.to_string_lossy().to_string();
            return Some(if version >= min {
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
        assert!((1, 8, 0) >= MIN_CODE_VERSION);
        assert!((2, 0, 0) >= MIN_CODE_VERSION);
        // Everything before it is below. Nothing under 1.4.0 has the `|`
        // comment and so cannot parse the entry euglena writes; 1.4.0 and
        // 1.5.0 could, but neither is a version anyone can install; and
        // nothing before 1.8.0 hears a door linked while the program runs
        // — see `MIN_CODE_VERSION`.
        assert!((1, 7, 0) < MIN_CODE_VERSION);
        assert!((1, 5, 0) < MIN_CODE_VERSION);
        assert!((1, 3, 0) < MIN_CODE_VERSION);
        assert!((0, 4, 1) < MIN_CODE_VERSION);
    }
}
