//! `euglena doctor` — one command answering what this migration made
//! invisible: which `code` was picked and how, whether this is a real
//! project, whether every declared organelle is installed, and whether
//! `main.code` is ours to regenerate. Every failing line names its fix.

use std::path::{Path, PathBuf};
use std::process;

use crate::codegen::EntryStatus;
use crate::exec::{self, CodeDiscovery, MIN_CODE_VERSION};
use crate::{codegen, config, invocation, manifest};

/// What the checks below found. `ok` is the exit code; `stale` is the one
/// finding that is worth mentioning without being a failure — a `main.code`
/// behind its inputs is the normal state between an edit and the next run,
/// and saying "everything checks out" right under a STALE block would read
/// as a contradiction.
struct Report {
    ok: bool,
    stale: bool,
}

pub fn run() {
    let mut report = Report {
        ok: true,
        stale: false,
    };
    let project_root = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));

    // The bar an app has to clear is not euglena's baseline alone — a
    // manifest may ask for more. Resolve it first so the interpreter section
    // reports against the version that will actually be enforced.
    let need = match exec::version_need(Some(&project_root), None) {
        Ok(need) => Some(need),
        Err(e) => {
            println!("manifest.json: {e}");
            println!();
            report.ok = false;
            None
        }
    };

    println!("Code interpreter:");
    check_code_binary(need.as_ref(), &mut report.ok);

    println!();
    println!("Project ({}):", project_root.display());
    check_project(&project_root, &mut report);

    println!();
    if !report.ok {
        println!("Some checks failed — see above.");
        process::exit(1);
    } else if report.stale {
        println!("Nothing broken — main.code is just behind its inputs.");
    } else {
        println!("Everything checks out.");
    }
}

fn check_code_binary(need: Option<&exec::VersionNeed>, ok: &mut bool) {
    let required = need.map_or(MIN_CODE_VERSION, |n| n.version);
    if let Some(need) = need {
        if need.version > MIN_CODE_VERSION {
            println!(
                "  required: v{} — {}",
                exec::fmt_version(need.version),
                need.reason
            );
        }
    }
    match config::read_code_binary_path() {
        Some(path) => match exec::code_interpreter_version(&path) {
            Some(v) if v >= required => {
                println!(
                    "  configured: {} (v{})",
                    path.display(),
                    exec::fmt_version(v)
                );
            }
            Some(v) => {
                println!(
                    "  configured: {} (v{} — below the required v{})",
                    path.display(),
                    exec::fmt_version(v),
                    exec::fmt_version(required)
                );
                *ok = false;
            }
            None => {
                println!(
                    "  configured: {} (does not respond to --version — broken?)",
                    path.display()
                );
                *ok = false;
            }
        },
        None => match exec::discover_cdlvsm_code_on_path(required) {
            Some(CodeDiscovery::Ready(p)) => println!("  discovered on PATH: {p}"),
            Some(CodeDiscovery::TooOld { path, version }) => {
                println!(
                    "  found on PATH but too old: {path} (v{}, need v{})",
                    exec::fmt_version(version),
                    exec::fmt_version(required)
                );
                println!("    fix: cdlvsm install code");
                *ok = false;
            }
            None => {
                println!("  none found");
                println!("    fix: cdlvsm install code");
                *ok = false;
            }
        },
    }
}

fn check_project(project_root: &Path, report: &mut Report) {
    if project_root.join(".code").is_dir() {
        println!("  .code/ marker: present");
    } else {
        println!("  .code/ marker: MISSING — not a code project root");
        println!(
            "    fix: {} init, or `code init` here",
            invocation::command_prefix()
        );
        report.ok = false;
    }

    let manifest_path = project_root.join("manifest.json");
    if !manifest_path.is_file() {
        println!("  manifest.json: none — this is a plain code project, not a Euglena app");
        println!(
            "    `{} run`/`build` need one; use code directly here, or",
            invocation::command_prefix()
        );
        println!(
            "    scaffold a cell with `{} init <name>`",
            invocation::command_prefix()
        );
        return;
    }

    match manifest::parse_manifest(&manifest_path) {
        Ok(app_manifest) => {
            println!(
                "  manifest.json: parses ({} organelle(s))",
                app_manifest.organelles.len()
            );
            for (alias, entry) in &app_manifest.organelles {
                let reference = entry.reference();
                match codegen::organelle_link_target(project_root, reference) {
                    Ok(target) => println!("    {alias} -> {reference} [{target}]"),
                    Err(e) => {
                        println!("    {alias} -> {reference} [MISSING]");
                        println!("      {e}");
                        report.ok = false;
                    }
                }
            }
        }
        Err(e) => {
            println!("  manifest.json: {e}");
            report.ok = false;
        }
    }

    check_entry(project_root, report);
}

/// Report where `main.code` stands. The states that need saying are the two
/// the GENERATED header alone can't distinguish: stale (the next run fixes
/// it) and hand-edited (the next run destroys it). Only the second fails the
/// checkup — being stale between an edit and the next run is the normal way
/// to be.
fn check_entry(project_root: &Path, report: &mut Report) {
    let cmd = invocation::command_prefix();
    match codegen::entry_status(project_root) {
        EntryStatus::Absent => {
            println!("  main.code: none yet (generated on first run/build/test)");
        }
        EntryStatus::HandWritten => {
            println!("  main.code: hand-written — euglena will refuse to regenerate it");
        }
        EntryStatus::UpToDate { euglena_version } => {
            println!("  main.code: up to date (generated by euglena {euglena_version})");
        }
        EntryStatus::Stale => {
            println!("  main.code: STALE — manifest.json, src/*.gene.code or .code/lock.json");
            println!("    have changed since it was generated. A plain `code run .` here would");
            println!("    run the old entry.");
            println!("    fix: {cmd} run   (build and test regenerate it too)");
            report.stale = true;
        }
        EntryStatus::Edited => {
            println!("  main.code: EDITED BY HAND after euglena generated it — the next");
            println!("    run/build/test overwrites it and those edits are gone.");
            println!("    fix: move the change into manifest.json or src/*.gene.code");
            report.ok = false;
        }
        EntryStatus::Unverifiable(e) => {
            println!("  main.code: cannot check — regenerating it fails:");
            println!("    {e}");
        }
    }
}
