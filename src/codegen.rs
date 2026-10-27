use std::fs;
use std::path::Path;

use crate::lockfile;
use crate::manifest::{parse_manifest, AppManifest, OrganelleEntry};
use crate::sha256;

/// Marks a `main.code` as ours. `write_main_code` refuses to overwrite any
/// file that doesn't start with this — a file the user wrote is not
/// euglena's to clobber.
pub const GENERATED_HEADER: &str =
    "| GENERATED — do not edit. Modify manifest.json or src/*.gene.code instead.";

/// Start of the *stamp* — the second line of every generated `main.code`,
/// recording which euglena wrote the file and the digest of everything below
/// it.
///
/// The header alone says "euglena owns this file"; it cannot say whether the
/// body is still the one euglena wrote. That distinction is the whole point:
/// a file that no longer hashes to its own stamp was **edited by hand**, and
/// the next `run`/`build`/`test` will silently throw those edits away. A
/// file that matches its stamp but no longer matches its inputs is merely
/// **stale**, and regenerating it is the fix rather than the loss.
const STAMP_PREFIX: &str = "| euglena ";

/// Separates the euglena version from the digest on the stamp line.
const STAMP_DIGEST_MARKER: &str = " · body sha256:";

/// What a generated `main.code`'s stamp line records.
pub struct Stamp {
    /// The euglena version that wrote the file.
    pub euglena_version: String,
    /// SHA-256 of the body — everything after the stamp line.
    pub body_sha256: String,
}

fn stamp_line(euglena_version: &str, body_sha256: &str) -> String {
    format!("{STAMP_PREFIX}{euglena_version}{STAMP_DIGEST_MARKER}{body_sha256}")
}

/// Read the stamp off a generated `main.code`.
///
/// `None` for a file that is not ours, or one written by a euglena old enough
/// to predate the stamp — both are handled the same way by callers: there is
/// nothing to verify against, so regenerate.
pub fn parse_stamp(text: &str) -> Option<Stamp> {
    let mut lines = text.lines();
    if lines.next()? != GENERATED_HEADER {
        return None;
    }
    let rest = lines.next()?.strip_prefix(STAMP_PREFIX)?;
    let (version, digest) = rest.split_once(STAMP_DIGEST_MARKER)?;
    if digest.len() != 64 || !digest.chars().all(|c| c.is_ascii_hexdigit()) {
        return None;
    }
    Some(Stamp {
        euglena_version: version.to_string(),
        body_sha256: digest.to_string(),
    })
}

/// The part of a generated `main.code` the stamp digests: everything after
/// the header and stamp lines. `None` if those two lines aren't there.
pub fn body_of(text: &str) -> Option<&str> {
    let after_header = text.strip_prefix(GENERATED_HEADER)?.strip_prefix('\n')?;
    let stamp_end = after_header.find('\n')?;
    Some(&after_header[stamp_end + 1..])
}

/// Scan `src_dir` for `*.gene.code` files and return their names sorted
/// alphabetically (e.g. `["data_fetcher.gene.code", "state_loader.gene.code"]`).
pub fn scan_genes(src_dir: &Path) -> Vec<String> {
    let mut genes: Vec<String> = Vec::new();

    let entries = match fs::read_dir(src_dir) {
        Ok(e) => e,
        Err(_) => return genes,
    };

    for entry in entries.flatten() {
        let name = entry.file_name();
        let name_str = name.to_string_lossy();
        if name_str.ends_with(".gene.code") && entry.path().is_file() {
            genes.push(name_str.to_string());
        }
    }

    genes.sort();
    genes
}

/// What an organelle's manifest reference resolves to on a `link` line.
///
/// A reference containing `/` or ending `.so`/`.code` is a literal path — a
/// vendored or locally-built organelle, used as written. Anything else is a
/// module name; it's checked against this project's `.code/lock.json` (the
/// file `code install` writes) to confirm it's installed, then linked as
/// `<name>.<ext>` — `link "console.so"`, not the platform-suffixed asset
/// `link "console-linux-x86_64.so"`. `code`'s loader maps the tidy spelling
/// back to the pinned asset through the same lockfile. `.wasm` is rejected up
/// front: `code`'s loader does not link `.wasm` organelles yet.
pub fn organelle_link_target(project_root: &Path, reference: &str) -> Result<String, String> {
    if reference.ends_with(".wasm") {
        return Err(format!(
            "organelle reference '{reference}' names a .wasm file — code does not support \
             linking .wasm organelles yet"
        ));
    }
    if reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code") {
        return Ok(reference.to_string());
    }
    match lockfile::read(project_root, reference) {
        Some(locked) => {
            let ext = Path::new(&locked.asset)
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("so");
            // Pinned with its native archive too (ticket 143): name the
            // module, and the build decides — an executable links the
            // archive in, a held application (`--target shared`) opens the
            // `.so` its host shares, the interpreter opens the `.so`. A pin
            // without one (every release before archives were published)
            // keeps naming the `.so`, so nothing an app has today changes
            // until it is re-pinned. A browser pin's asset is its wasm
            // archive and keeps its path.
            if locked.static_archive && ext == "so" {
                return Ok(reference.to_string());
            }
            Ok(format!("{reference}.{ext}"))
        }
        None => Err(format!(
            "organelle '{reference}' is declared in manifest.json but not installed — run \
             `{} install {reference}`",
            crate::invocation::command_prefix()
        )),
    }
}

/// Generate the content of `main.code` from a manifest, a list of gene
/// filenames (as returned by `scan_genes`), and `project_root` (needed to
/// resolve module-name organelle references against `.code/lock.json`).
///
/// The result is the [`GENERATED_HEADER`], the stamp line (see
/// [`STAMP_PREFIX`]), a blank line, and then the body the stamp digests.
/// How a `${VAR}` in an organelle's `config` block reaches the program
/// (ticket 170).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EnvMode {
    /// Read from the process environment when the program starts, through
    /// the application's `env` organelle: a program of its own (`run`,
    /// `build --target exe`). Nothing secret is written into the entry or the
    /// binary, and one build runs in any environment that sets the variables.
    Runtime,
    /// Read when the application starts, as `Runtime`, but from its own
    /// `.env` file rather than the process environment: a held application
    /// (`--target shared`) runs inside a host, whose process environment is
    /// the host's (ticket 180). Its `env` organelle is pointed at the file
    /// first (`Config { file }`, env ≥ 2.19). An application that declares
    /// no `env` organelle, or pins one from before `Config`, is `Baked`.
    Held,
    /// Written into the entry as text, as before: a page (`wasm`: a browser
    /// has no environment), a static archive, the fixtures' entry (`test`),
    /// and a held application that cannot read its own file yet.
    Baked,
}

pub fn generate_main_code(
    manifest: &AppManifest,
    genes: &[String],
    project_root: &Path,
    mode: EnvMode,
) -> Result<String, String> {
    let mut lines = Vec::new();

    // Organelle link statements — always aliased, always a quoted reference.
    //
    // Except a stand-in one (`"hosted": "membrane"`), which is not known until
    // the application runs and finds out whether it is being held. That one
    // links from inside a handler instead, and binds an *address* under the
    // same alias — which `emit` accepts, so the setup line below and every
    // gene reading the alias stay exactly as they were.
    let mut picks = Vec::new();
    for (alias, entry) in &manifest.organelles {
        let target = organelle_link_target(project_root, entry.reference())?;
        match entry.hosted() {
            None => lines.push(format!("link \"{}\" as {}", target, alias)),
            Some(stand_in) => {
                // Checked before the paths are resolved, so a pair that
                // could never work is reported as the mismatch it is rather
                // than as whichever file was looked for first.
                check_stand_in_agrees(project_root, alias, entry, stand_in)?;
                let alone = organelle_runtime_path(project_root, entry.reference())?;
                let held = organelle_runtime_path(project_root, stand_in)?;
                picks.push(format!(
                    "emit {PICK_PARTICLE} {{ alone = \"{alone}\", held = \"{held}\" }} \
                     to this get _pick_{alias}\n{alias} = _pick_{alias}.organelle"
                ));
            }
        }
    }

    if !manifest.organelles.is_empty() && lines.iter().any(|l| l.starts_with("link ")) {
        lines.push(String::new());
    }

    if !picks.is_empty() {
        lines.push(pick_handler().to_string());
        lines.push(String::new());
        for pick in picks {
            lines.push(pick);
        }
        lines.push(String::new());
    }

    // Setup particles — for each organelle carrying a `config` block, emit
    // the particle its module declares as `setup` (`Config`, `Listen`, …)
    // with the block's fields. The result is captured so a gene can check it
    // (`_cfg_<alias> ∈ Exception`).
    //
    // Before the gene links, not after: a gene like `src/server.gene.code`
    // runs an unbounded keep-alive `loop` at link time, and anything emitted
    // after that link never runs. A stateful organelle configured from the
    // manifest has to be set up before that loop starts.
    // A held application reads its own file when its env organelle can;
    // otherwise its values are baked in, as they always were.
    let held_file = match mode {
        EnvMode::Held => held_env_file(manifest, project_root),
        _ => None,
    };
    let mode = match (mode, &held_file) {
        (EnvMode::Held, Some(_)) => EnvMode::Runtime,
        (EnvMode::Held, None) => EnvMode::Baked,
        (other, _) => other,
    };
    let mut emitted_setup = false;
    let mut reads = EnvReads::default();
    for (alias, entry) in &manifest.organelles {
        let Some(fields) = entry.config() else {
            continue;
        };
        let setup = setup_particle(project_root, alias, entry)?;
        match mode {
            // `Held` was settled above; it is one of the other two by here.
            EnvMode::Baked | EnvMode::Held => {
                let baked: serde_json::Map<String, serde_json::Value> = fields
                    .iter()
                    .map(|(k, v)| (k.clone(), crate::manifest::bake_env(v)))
                    .collect();
                lines.push(generate_setup_line(&setup, alias, &baked));
            }
            EnvMode::Runtime => {
                let line = generate_runtime_setup_line(&setup, alias, fields, &mut reads);
                if !reads.lines.is_empty() && reads.env_alias.is_none() {
                    reads.env_alias = Some(env_alias(manifest, alias)?);
                }
                reads.pending.push(line);
            }
        }
        emitted_setup = true;
    }
    // In runtime mode the variables are read first, each once, then every
    // setup line that uses them.
    let env = reads.env_alias.clone().unwrap_or_default();
    if let (Some(file), false) = (&held_file, reads.lines.is_empty()) {
        lines.push(format!(
            "emit Config {{ file = {} }} to {env} get _env_file",
            format_config_value(&serde_json::Value::String(file.clone()))
        ));
        lines.push("assert _env_file ∉ Exception".to_string());
    }
    for read in &reads.lines {
        lines.push(read.replace(ENV_ALIAS_SLOT, &env));
    }
    if !reads.lines.is_empty() {
        lines.push(String::new());
    }
    lines.append(&mut reads.pending);

    if emitted_setup {
        lines.push(String::new());
    }

    // Installed genes first, then the application's own.
    //
    // A gene has no alias and no namespace: its handlers join the one
    // program-wide table, exactly as `src/*.gene.code` do. Installed ones
    // come first so an application reads its own last, which is the order
    // a reader expects and the order a duplicate is reported in. A name
    // defined twice is refused before the program runs — a shipped gene's
    // handler names are reserved for every application that installs it.
    let mut installed = Vec::new();
    for name in &manifest.genes {
        crate::genes::verify(project_root, name)?;
        match crate::genes::installed_path(project_root, name) {
            Some(path) => installed.push(path.display().to_string().replace('\\', "/")),
            None => {
                return Err(format!(
                    "manifest.json declares the gene '{name}', but it is not installed — \
                     run `euglena install`"
                ))
            }
        }
    }
    // The pins, written into the entry itself.
    //
    // Without this the entry names only a *path*, so a gene republished at
    // the same version leaves the generated text identical and every
    // application goes on reporting "up to date" while compiling in bytes
    // that changed. The digest is part of the body, so the stamp covers it
    // and `doctor` says STALE the moment a pin moves.
    for name in &manifest.genes {
        if let Some(pinned) = crate::genes::locked(project_root, name) {
            let short: String = pinned.sha256.chars().take(12).collect();
            lines.push(format!("| gene {name}@{} sha256:{short}", pinned.version));
        }
    }
    for path in &installed {
        lines.push(format!("link \"{path}\""));
    }

    // Gene link statements — quoted, relative to the project root the
    // generated entry now lives at.
    for gene in genes {
        lines.push(format!("link \"src/{gene}\""));
    }

    if !genes.is_empty() || !installed.is_empty() {
        lines.push(String::new());
    }

    // Boot particle.
    lines.push(format!(
        "emit EuglenaHasBeenBorn {{ cell_name = \"{}\" }} to this",
        manifest.name
    ));
    lines.push(String::new());

    // The body is *everything after the stamp line*, blank separator
    // included — exactly what `body_of` hands back, so the digest a file
    // carries and the digest recomputed from it can never disagree over
    // where the body starts.
    let body = format!("\n{}", lines.join("\n"));
    let stamp = stamp_line(env!("CARGO_PKG_VERSION"), &sha256::hex(body.as_bytes()));
    Ok(format!("{GENERATED_HEADER}\n{stamp}\n{body}"))
}

/// The particle euglena emits to configure `alias` from its `config` block.
///
/// A literal-path organelle must name it in the entry (`"setup": "Config"`),
/// since there is no lockfile row to read. A module name reads the `setup`
/// its `module.json` declared, recorded in `.code/lock.json` by `code
/// install`; a stateless module has none, and a `config` block on one is a
/// mistake worth stopping for.
/// Where an organelle's bytes actually are — an absolute path, for a `link`
/// that happens while the application runs.
///
/// A top-level `link` may name a module the tidy way (`"net_server.so"`),
/// because `code`'s loader resolves that against the project's lockfile
/// before the program is built. A `link` inside a handler gets no such pass:
/// its path is a value, taken as written and relative to the working
/// directory. So euglena resolves it here instead, to the same file the
/// loader would have found — and absolutely, which is what a top-level link
/// bakes into a built binary anyway.
fn organelle_runtime_path(project_root: &Path, reference: &str) -> Result<String, String> {
    let target = organelle_link_target(project_root, reference)?;
    let candidates =
        if reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code") {
            vec![project_root.join(&target)]
        } else {
            let locked = lockfile::read(project_root, reference).ok_or_else(|| {
                format!(
                    "organelle '{reference}' is declared in manifest.json but not installed — run \
                 `{} install {reference}`",
                    crate::invocation::command_prefix()
                )
            })?;
            vec![project_root
                .join(".code")
                .join("modules")
                .join(reference)
                .join(&locked.version)
                .join(&locked.asset)]
        };
    for candidate in &candidates {
        if let Ok(canonical) = fs::canonicalize(candidate) {
            return Ok(canonical.to_string_lossy().into_owned());
        }
    }
    Err(format!(
        "organelle '{reference}' is declared in manifest.json but its file is not where the \
         lockfile says it is ({}) — run `{} install {reference}` again",
        candidates[0].display(),
        crate::invocation::command_prefix()
    ))
}

/// The particle euglena emits to choose between an organelle and its hosted
/// stand-in. Named for the generated entry, which is the only place it exists;
/// a gene that defined a handler of this name would be answering euglena's
/// own question, so the name is deliberately one nobody would reach for.
const PICK_PARTICLE: &str = "EuglenaPickOrganelle";

/// The handler that does the choosing, generated once however many aliases
/// need it.
///
/// It has to be a handler rather than three top-level lines because `link`
/// takes a path it works out while running only inside a handler body — and
/// because the alias has to survive the choice, which it does by coming back
/// as an ordinary value the entry binds.
///
/// `Linked` is answered by the runtime itself, from what this was built as:
/// an application compiled `--target shared` is a module somebody links, and
/// it knows that from its first statement. It is not a question about hosts
/// — `code` knows nothing about euglena — but it is the one that matters
/// here, because a door of its own is what would make a held application
/// impossible to unload.
fn pick_handler() -> String {
    format!(
        "{PICK_PARTICLE} {{ alone, held }} => {{\n    \
         emit Linked to core get _where\n    \
         if _where.value {{\n        \
         link held as _held_organelle\n        \
         return EuglenaOrganellePicked {{ organelle = _held_organelle }}\n    \
         }}\n    \
         link alone as _alone_organelle\n    \
         return EuglenaOrganellePicked {{ organelle = _alone_organelle }}\n\
         }}"
    )
}

/// Both sides of a `hosted` pair have to answer the same setup particle,
/// because one `config` block is emitted for whichever gets linked and the
/// entry cannot know in advance which that will be.
///
/// Checked here rather than left to runtime: a mismatch would surface as a
/// configuration particle nobody handles, in whichever of the two lives the
/// application happened not to be tested in.
fn check_stand_in_agrees(
    project_root: &Path,
    alias: &str,
    entry: &OrganelleEntry,
    stand_in: &str,
) -> Result<(), String> {
    if entry.config().is_none() {
        return Ok(());
    }
    let theirs = match lockfile::read(project_root, stand_in).and_then(|m| m.setup) {
        Some(particle) => particle,
        None => return Ok(()),
    };
    let ours = setup_particle(project_root, alias, entry)?;
    if ours != theirs {
        return Err(format!(
            "organelle '{alias}' is configured with `{ours}` but its hosted stand-in \
             '{stand_in}' is configured with `{theirs}` — one `config` block is emitted for \
             whichever of the two gets linked, so both have to answer the same particle"
        ));
    }
    Ok(())
}

fn setup_particle(
    project_root: &Path,
    alias: &str,
    entry: &OrganelleEntry,
) -> Result<String, String> {
    if let Some(explicit) = entry.setup() {
        return Ok(explicit.to_string());
    }
    let reference = entry.reference();
    if reference.contains('/') || reference.ends_with(".so") || reference.ends_with(".code") {
        return Err(format!(
            "organelle '{alias}' is a literal path with a `config` block — name the particle \
             that configures it, e.g. \"setup\": \"Config\", in its manifest entry"
        ));
    }
    match lockfile::read(project_root, reference).and_then(|m| m.setup) {
        Some(particle) => Ok(particle),
        None => Err(format!(
            "organelle '{alias}' ({reference}) has a `config` block but its module is \
             stateless — it has no setup particle. Drop the `config` block; a stateless \
             module takes its parameters per call.\n(If '{reference}' *is* stateful, its \
             lockfile row predates `setup` — re-run `{} install {reference}`.)",
            crate::invocation::command_prefix()
        )),
    }
}

/// Where the `env` organelle's alias goes in a read written before it is
/// known (the first `${VAR}` decides that it is needed).
const ENV_ALIAS_SLOT: &str = "\u{0}env\u{0}";

/// The variables a runtime-mode entry reads, in the order first met.
#[derive(Default)]
struct EnvReads {
    names: Vec<String>,
    lines: Vec<String>,
    pending: Vec<String>,
    env_alias: Option<String>,
}

impl EnvReads {
    /// The expression that holds `name`'s value once read, reading it the
    /// first time it is asked for.
    ///
    /// Read as text (`Require`: unset stops the program at start, the failing
    /// line naming the variable), then as a number when it is one — what the
    /// baked entry does by promoting `"${PORT}"` to `8080`.
    fn value_of(&mut self, name: &str) -> String {
        let value = format!("_env_{name}");
        if !self.names.iter().any(|n| n == name) {
            self.names.push(name.to_string());
            self.lines.extend([
                format!("emit Require {{ name = \"{name}\" }} to {ENV_ALIAS_SLOT} get _env_read_{name}"),
                format!("assert _env_read_{name} ∉ Exception"),
                format!("emit Get {{ name = \"{name}\", default = 0 }} to {ENV_ALIAS_SLOT} get _env_number_{name}"),
                format!("{value} = _env_read_{name}.value"),
                format!("if _env_number_{name} ∉ Exception, {value} = _env_number_{name}.value"),
            ]);
        }
        value
    }
}

/// The `.env` a held application reads, when its `env` organelle can be
/// pointed at one: declared, and pinned at a version whose setup particle is
/// `Config` (env ≥ 2.19).
fn held_env_file(manifest: &AppManifest, project_root: &Path) -> Option<String> {
    let declared = manifest
        .organelles
        .values()
        .any(|entry| entry.reference() == "env");
    let configurable = lockfile::read(project_root, "env")
        .and_then(|m| m.setup)
        .is_some_and(|setup| setup == "Config");
    if !(declared && configurable) {
        return None;
    }
    // The file itself, resolved: a build made in a folder of links to the
    // application (`tools/euglena-preserving-entry.py`) must name the real
    // `.env`, not a link in a folder that is gone once the build is done.
    let file = project_root.join(".env");
    let real = file.canonicalize().unwrap_or_else(|_| {
        project_root
            .canonicalize()
            .unwrap_or_else(|_| project_root.to_path_buf())
            .join(".env")
    });
    Some(real.display().to_string().replace('\\', "/"))
}

/// The alias of the application's own `env` organelle, which a runtime-mode
/// entry reads its variables through.
fn env_alias(manifest: &AppManifest, configured: &str) -> Result<String, String> {
    manifest
        .organelles
        .iter()
        .find(|(_, entry)| entry.reference() == "env")
        .map(|(alias, _)| alias.clone())
        .ok_or_else(|| {
            format!(
                "organelle '{configured}' is configured with a `${{VAR}}`, which a program of its \
                 own reads when it starts — declare the env module it reads it with: \
                 \"env\": \"env\" in \"organelles\", then `{} install`",
                crate::invocation::command_prefix()
            )
        })
}

/// A config value as an expression that reads its `${VAR}`s at run time.
/// A value with none is the literal it always was.
fn format_runtime_value(v: &serde_json::Value, reads: &mut EnvReads) -> String {
    match v {
        serde_json::Value::String(s) if s.contains("${") => {
            let mut parts: Vec<String> = Vec::new();
            let mut rest = s.as_str();
            while let Some(start) = rest.find("${") {
                let Some(len) = rest[start + 2..].find('}') else {
                    break;
                };
                if start > 0 {
                    parts.push(format_config_value(&serde_json::Value::String(
                        rest[..start].to_string(),
                    )));
                }
                parts.push(reads.value_of(&rest[start + 2..start + 2 + len]));
                rest = &rest[start + 3 + len..];
            }
            if !rest.is_empty() {
                parts.push(format_config_value(&serde_json::Value::String(
                    rest.to_string(),
                )));
            }
            match parts.len() {
                // A whole value that is one variable keeps the variable's
                // kind (a port stays a number).
                1 => parts.remove(0),
                // Text around it makes it text: `"" +` keeps `+` joining
                // even when the first variable is a number.
                _ => format!("\"\" + {}", parts.join(" + ")),
            }
        }
        serde_json::Value::Array(items) => {
            let items: Vec<String> = items
                .iter()
                .map(|i| format_runtime_value(i, reads))
                .collect();
            format!("[{}]", items.join(", "))
        }
        serde_json::Value::Object(map) => {
            let parts: Vec<String> = map
                .iter()
                .map(|(k, v)| format!("{} = {}", k, format_runtime_value(v, reads)))
                .collect();
            format!("{{ {} }}", parts.join(", "))
        }
        other => format_config_value(other),
    }
}

fn generate_runtime_setup_line(
    setup: &str,
    target: &str,
    fields: &serde_json::Map<String, serde_json::Value>,
    reads: &mut EnvReads,
) -> String {
    if fields.is_empty() {
        return format!("emit {setup} {{}} to {target} get _cfg_{target}");
    }
    let field_str: Vec<String> = fields
        .iter()
        .map(|(k, v)| format!("{} = {}", k, format_runtime_value(v, reads)))
        .collect();
    format!(
        "emit {setup} {{ {} }} to {target} get _cfg_{target}",
        field_str.join(", ")
    )
}

fn format_config_value(v: &serde_json::Value) -> String {
    match v {
        serde_json::Value::String(s) => {
            format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""))
        }
        serde_json::Value::Number(n) => n.to_string(),
        serde_json::Value::Bool(b) => b.to_string(),
        serde_json::Value::Array(arr) => {
            let items: Vec<String> = arr.iter().map(format_config_value).collect();
            format!("[{}]", items.join(", "))
        }
        serde_json::Value::Object(map) => {
            // Anonymous object literal: `{ k = v, ... }`.
            let parts: Vec<String> = map
                .iter()
                .map(|(k, v)| format!("{} = {}", k, format_config_value(v)))
                .collect();
            format!("{{ {} }}", parts.join(", "))
        }
        serde_json::Value::Null => "null".to_string(),
    }
}

/// `emit <Setup> { … } to <alias> get _cfg_<alias>` — the setup particle
/// (`Config`, `Listen`, …) is unqualified, since dispatch is per-recipient
/// (`to <alias>`), which already disambiguates.
fn generate_setup_line(
    setup: &str,
    target: &str,
    fields: &serde_json::Map<String, serde_json::Value>,
) -> String {
    if fields.is_empty() {
        format!("emit {setup} {{}} to {target} get _cfg_{target}")
    } else {
        let field_str: Vec<String> = fields
            .iter()
            .map(|(k, v)| format!("{} = {}", k, format_config_value(v)))
            .collect();
        format!(
            "emit {setup} {{ {} }} to {target} get _cfg_{target}",
            field_str.join(", "),
        )
    }
}

/// What `main.code` would be if it were generated right now — from whatever
/// `manifest.json`, `src/*.gene.code` and `.code/lock.json` say at this
/// moment, under this process's environment (`.env` interpolation and
/// `EUGLENA_MOCK_MODE` both feed generation).
pub fn regenerate(project_root: &Path, mode: EnvMode) -> Result<String, String> {
    let manifest = parse_manifest(&project_root.join("manifest.json"))?;
    let genes = scan_genes(&project_root.join("src"));
    generate_main_code(&manifest, &genes, project_root, mode)
}

/// Where a project's `main.code` stands relative to the inputs it came from.
///
/// The two states worth a user's attention are the two the
/// [`GENERATED_HEADER`] alone could never tell apart: `Stale`, which the next
/// `run`/`build`/`test` fixes by itself, and `Edited`, which the next
/// `run`/`build`/`test` destroys.
pub enum EntryStatus {
    /// No `main.code` yet — generated on the first `run`/`build`/`test`.
    Absent,
    /// Present but not ours: euglena refuses to regenerate over it.
    HandWritten,
    /// Ours, and byte-for-byte what the current inputs generate.
    UpToDate { euglena_version: String },
    /// Ours and unedited, but the inputs have moved on since it was written
    /// — or it predates the stamp, so there is nothing to verify it against.
    /// Regenerating is the fix, and every `run`/`build`/`test` does it.
    Stale,
    /// Ours by header, but the body no longer hashes to its own stamp:
    /// someone edited a generated file. Those edits die on the next
    /// `run`/`build`/`test`, so this is the one state worth failing on.
    Edited,
    /// Ours, but freshness is unknowable because regenerating fails — a
    /// missing organelle, an unparseable manifest. Carries that reason.
    Unverifiable(String),
}

/// Classify `<project_root>/main.code`. See [`EntryStatus`].
///
/// Note that generation reads the environment, so this answers the question
/// *for this process*: a `main.code` generated under `EUGLENA_MOCK_MODE=true`
/// is correctly reported `Stale` from a shell without it — the mock overlay
/// really did produce a different entry, and running without the variable
/// really will regenerate.
pub fn entry_status(project_root: &Path) -> EntryStatus {
    let Ok(text) = fs::read_to_string(project_root.join("main.code")) else {
        return EntryStatus::Absent;
    };
    if !text.starts_with(GENERATED_HEADER) {
        return EntryStatus::HandWritten;
    }

    // A hand-edit is checked before staleness: it's the destructive state,
    // and an edited file is usually stale as well, so reporting "stale"
    // first would bury the warning that matters.
    let (Some(stamp), Some(body)) = (parse_stamp(&text), body_of(&text)) else {
        // Our header, no readable stamp — written by a euglena that predates
        // it. Nothing to verify against; regenerating restores the stamp.
        return EntryStatus::Stale;
    };
    if sha256::hex(body.as_bytes()) != stamp.body_sha256 {
        return EntryStatus::Edited;
    }

    // Up to date if it is what any mode would write: which one wrote it
    // depends on the command that last ran (`run` reads at run time, a held
    // build reads its own file or bakes, `test` bakes), and none is staler
    // than another.
    match regenerate(project_root, EnvMode::Baked) {
        Ok(fresh) if fresh == text => EntryStatus::UpToDate {
            euglena_version: stamp.euglena_version,
        },
        Ok(_) => {
            let fresh = [EnvMode::Runtime, EnvMode::Held]
                .into_iter()
                .any(|mode| regenerate(project_root, mode).is_ok_and(|fresh| fresh == text));
            if fresh {
                EntryStatus::UpToDate {
                    euglena_version: stamp.euglena_version,
                }
            } else {
                EntryStatus::Stale
            }
        }
        Err(e) => EntryStatus::Unverifiable(e),
    }
}

/// Generate `<project_root>/main.code` from `manifest.json` and
/// `src/*.gene.code`, and write it there.
///
/// Refuses to overwrite a `main.code` that doesn't carry [`GENERATED_HEADER`]
/// — that's a file the user wrote, and clobbering it is not euglena's call.
/// The file is left in place afterward (gitignored by `euglena init`): a
/// readable artifact that plain `code run .` also executes is worth more
/// than a hidden one.
pub fn write_main_code(project_root: &Path, mode: EnvMode) -> Result<Generated, String> {
    let content = regenerate(project_root, mode)?;

    let entry_path = project_root.join("main.code");
    if entry_path.is_file() {
        let existing = fs::read_to_string(&entry_path).unwrap_or_default();
        if !existing.starts_with(GENERATED_HEADER) {
            return Err(format!(
                "'{}' already exists and was not generated by euglena — refusing to overwrite. \
                 Remove or rename it if you want euglena to manage this project's entry.",
                entry_path.display()
            ));
        }
    }

    fs::write(&entry_path, &content)
        .map_err(|e| format!("cannot write '{}': {}", entry_path.display(), e))?;

    Ok(Generated {
        genes: content
            .lines()
            .filter(|l| l.starts_with("link \"src/"))
            .count(),
        organelles: content
            .lines()
            .filter(|l| l.starts_with("link \"") && !l.starts_with("link \"src/"))
            .count(),
    })
}

/// What a generation produced, for `-v` to report. Counted off the emitted
/// links rather than off the manifest, so the number is what actually landed
/// in the file.
#[derive(Debug)]
pub struct Generated {
    pub genes: usize,
    pub organelles: usize,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::manifest::{AppManifest, OrganelleEntry};
    use std::collections::BTreeMap;
    use std::path::PathBuf;

    fn make_manifest(name: &str, organelles: &[(&str, &str)]) -> AppManifest {
        let mut map = BTreeMap::new();
        for (alias, reference) in organelles {
            map.insert(
                alias.to_string(),
                OrganelleEntry::Reference(reference.to_string()),
            );
        }
        AppManifest {
            name: name.to_string(),
            organelles: map,
            genes: Vec::new(),
        }
    }

    fn tmp_root(tag: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!(
            "euglena_codegen_test_{}_{}",
            std::process::id(),
            tag
        ));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn generate_no_organelles_no_genes() {
        let m = make_manifest("my-app", &[]);
        let root = tmp_root("no_org_no_gene");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"my-app\" } to this"));
        assert!(!content.contains("link"));
        assert!(content.starts_with(GENERATED_HEADER));
        assert!(GENERATED_HEADER.starts_with("|"));
    }

    #[test]
    fn generate_literal_path_organelles_and_genes() {
        let m = make_manifest(
            "todo",
            &[
                ("react", "organelles/react.so"),
                ("storage", "organelles/storage.so"),
            ],
        );
        let genes = vec![
            "state_loader.gene.code".to_string(),
            "todo_actions.gene.code".to_string(),
        ];
        let root = tmp_root("literal_paths");
        let content = generate_main_code(&m, &genes, &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"organelles/react.so\" as react"));
        assert!(content.contains("link \"organelles/storage.so\" as storage"));
        assert!(content.contains("link \"src/state_loader.gene.code\""));
        assert!(content.contains("link \"src/todo_actions.gene.code\""));
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"todo\" } to this"));
    }

    #[test]
    fn generate_module_name_organelle_resolves_via_lockfile() {
        let root = tmp_root("module_name");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"console":{"name":"console","version":"1.1.3","asset":"console-linux-x86_64.so"}}}"#,
        )
        .unwrap();
        let m = make_manifest("myapp", &[("term", "console")]);
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        // Linked by module name, not the platform-suffixed asset — code's
        // loader maps `console.so` back to the pinned asset via lock.json.
        assert!(content.contains("link \"console.so\" as term"));
    }

    /// Pinned with its native archive as well (code tickets 141/142): the
    /// module is named and the build chooses — linked in for an executable,
    /// the shared `.so` for a held application (ticket 143). The test above
    /// keeps the older pin's `console.so`.
    #[test]
    fn generate_module_name_organelle_pinned_with_its_archive_is_named() {
        let root = tmp_root("module_name_archive");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"math":{"name":"math","version":"2.18.0","asset":"math-linux-x86_64.so",
                "static_archive":{"asset":"math-linux-x86_64.a","sha256":"ab","link":["-lm"]}}}}"#,
        )
        .unwrap();
        let m = make_manifest("myapp", &[("math", "math")]);
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"math\" as math"), "{content}");
    }

    #[test]
    fn generate_module_name_organelle_keeps_static_extension() {
        let root = tmp_root("module_name_static");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"crunch":{"name":"crunch","version":"0.2.0","asset":"crunch-linux-x86_64.a"}}}"#,
        )
        .unwrap();
        let m = make_manifest("myapp", &[("crunch", "crunch")]);
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"crunch.a\" as crunch"));
    }

    #[test]
    fn generate_module_name_organelle_not_installed_errors() {
        let root = tmp_root("module_missing");
        let m = make_manifest("myapp", &[("term", "console")]);
        let err = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap_err();
        assert!(err.contains("console"), "error should name it: {err}");
        assert!(err.contains("install"), "error should hint the fix: {err}");
    }

    #[test]
    fn generate_wasm_organelle_rejected() {
        let root = tmp_root("wasm_rejected");
        let m = make_manifest("myapp", &[("ui", "organelles/ui.wasm")]);
        let err = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap_err();
        assert!(err.contains("wasm"));
    }

    /// An organelle with a hosted stand-in is not linked up front: it is
    /// chosen while the application runs, and the alias every gene already
    /// writes is bound to whichever one it picked.
    #[test]
    fn generate_hosted_stand_in_is_picked_at_runtime() {
        let root = tmp_root("hosted_stand_in");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "net_server":{"name":"net_server","version":"1.0.0","asset":"net_server-linux-x86_64.so","setup":"Config"},
                "membrane":{"name":"membrane","version":"1.0.0","asset":"membrane-linux-x86_64.so","setup":"Config"}
            }}"#,
        )
        .unwrap();
        // Real files, because a runtime `link` gets no loader pass: euglena
        // resolves the path itself and refuses one that is not there.
        let mut installed = Vec::new();
        for (name, asset) in [
            ("net_server", "net_server-linux-x86_64.so"),
            ("membrane", "membrane-linux-x86_64.so"),
        ] {
            let dir = root.join(".code/modules").join(name).join("1.0.0");
            fs::create_dir_all(&dir).unwrap();
            fs::write(dir.join(asset), b"").unwrap();
            installed.push(fs::canonicalize(dir.join(asset)).unwrap());
        }

        let mut map = BTreeMap::new();
        let mut config = serde_json::Map::new();
        config.insert("port".to_string(), serde_json::json!("8080"));
        map.insert(
            "net".to_string(),
            OrganelleEntry::Full {
                reference: "net_server".to_string(),
                config,
                setup: None,
                hosted: Some("membrane".to_string()),
            },
        );
        let m = AppManifest {
            name: "twolives".to_string(),
            organelles: map,
            genes: Vec::new(),
        };
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();

        // Not linked up front — that is the whole point.
        assert!(
            !content.contains("link \"net_server.so\" as net"),
            "a stand-in organelle must not be linked before the choice:\n{content}"
        );
        assert!(content.contains("EuglenaPickOrganelle { alone, held } =>"));
        assert!(content.contains("emit Linked to core get _where"));
        // Absolute, and the file the lockfile pins — the tidy spelling is
        // the loader's trick, and a runtime `link` does not get it.
        assert!(
            content.contains(&format!(
            "emit EuglenaPickOrganelle {{ alone = \"{}\", held = \"{}\" }} to this get _pick_net",
            installed[0].display(),
            installed[1].display()
        )),
            "{content}"
        );
        assert!(content.contains("net = _pick_net.organelle"));

        // And the alias is still the alias: one config block, emitted to the
        // name, whichever organelle ended up behind it.
        assert!(content.contains("emit Config { port = \"8080\" } to net get _cfg_net"));

        // The choice has to be made before anything is emitted to the name.
        let pick = content.find("net = _pick_net.organelle").unwrap();
        let cfg = content.find("emit Config").unwrap();
        assert!(
            pick < cfg,
            "the organelle is configured before it exists:\n{content}"
        );
    }

    /// One `config` block is emitted for whichever organelle gets linked, so
    /// two that are configured differently cannot stand in for each other.
    #[test]
    fn generate_hosted_stand_in_must_take_the_same_setup() {
        let root = tmp_root("hosted_mismatch");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "net_server":{"name":"net_server","version":"1.0.0","asset":"net_server-linux-x86_64.so","setup":"Config"},
                "odd":{"name":"odd","version":"1.0.0","asset":"odd-linux-x86_64.so","setup":"Listen"}
            }}"#,
        )
        .unwrap();

        let mut map = BTreeMap::new();
        let mut config = serde_json::Map::new();
        config.insert("port".to_string(), serde_json::json!("8080"));
        map.insert(
            "net".to_string(),
            OrganelleEntry::Full {
                reference: "net_server".to_string(),
                config,
                setup: None,
                hosted: Some("odd".to_string()),
            },
        );
        let m = AppManifest {
            name: "mismatch".to_string(),
            organelles: map,
            genes: Vec::new(),
        };
        let err = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap_err();
        assert!(err.contains("Config") && err.contains("Listen"), "{err}");
        assert!(
            err.contains("odd"),
            "the error should name the stand-in: {err}"
        );
    }

    /// Ordinary organelles are untouched by any of this — no picker, no
    /// handler, nothing generated that was not generated before.
    #[test]
    fn generate_without_a_stand_in_generates_no_picker() {
        let m = make_manifest("plain", &[("term", "organelles/term.so")]);
        let root = tmp_root("no_picker");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"organelles/term.so\" as term"));
        assert!(!content.contains("EuglenaPickOrganelle"));
        assert!(!content.contains("Linked"));
    }

    #[test]
    fn generate_header_marks_as_generated() {
        let m = make_manifest("x", &[]);
        let root = tmp_root("header");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.starts_with(GENERATED_HEADER));
    }

    #[test]
    fn generated_entry_is_stamped_with_its_own_body_digest() {
        let m = make_manifest("x", &[]);
        let root = tmp_root("stamp");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();

        let stamp = parse_stamp(&content).expect("a generated entry carries a stamp");
        assert_eq!(stamp.euglena_version, env!("CARGO_PKG_VERSION"));

        let body = body_of(&content).expect("a stamped entry has a body");
        assert_eq!(sha256::hex(body.as_bytes()), stamp.body_sha256);
        // The stamp digests the body, not itself: the code lives below it.
        assert!(body.contains("emit EuglenaHasBeenBorn"));
        assert!(!body.contains(STAMP_PREFIX));
    }

    #[test]
    fn stamp_sits_on_the_second_line_and_leaves_the_body_alone() {
        let m = make_manifest("x", &[("term", "organelles/term.so")]);
        let root = tmp_root("stamp_layout");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        let lines: Vec<&str> = content.lines().collect();
        assert_eq!(lines[0], GENERATED_HEADER);
        assert!(lines[1].starts_with(STAMP_PREFIX));
        assert_eq!(lines[2], "");
        assert_eq!(lines[3], "link \"organelles/term.so\" as term");
    }

    #[test]
    fn parse_stamp_rejects_what_is_not_one() {
        assert!(parse_stamp("| hand-written\nassert 1 = 1\n").is_none());
        // Our header but no stamp — an entry from a euglena that predates it.
        assert!(parse_stamp(&format!("{GENERATED_HEADER}\n\nassert 1 = 1\n")).is_none());
        // A stamp whose digest is not 64 hex characters is not a stamp.
        let short =
            format!("{GENERATED_HEADER}\n{STAMP_PREFIX}0.2.0{STAMP_DIGEST_MARKER}abc\n\nx\n");
        assert!(parse_stamp(&short).is_none());
    }

    /// The states `entry_status` exists to tell apart: a file the next
    /// run/build/test would harmlessly rewrite, versus one it would destroy.
    fn stamped_project(tag: &str) -> PathBuf {
        let root = tmp_root(tag);
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        write_main_code(&root, EnvMode::Baked).unwrap();
        root
    }

    #[test]
    fn entry_status_absent_and_hand_written() {
        let root = tmp_root("status_absent");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Absent));

        fs::write(root.join("main.code"), "| mine\nassert 1 = 1\n").unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::HandWritten));
    }

    #[test]
    fn entry_status_up_to_date_right_after_generation() {
        let root = stamped_project("status_fresh");
        match entry_status(&root) {
            EntryStatus::UpToDate { euglena_version } => {
                assert_eq!(euglena_version, env!("CARGO_PKG_VERSION"));
            }
            _ => panic!("a just-generated entry should be up to date"),
        }
    }

    #[test]
    fn entry_status_goes_stale_when_an_input_changes() {
        let root = stamped_project("status_stale");
        // Rename the cell: the entry still hashes to its own stamp, but it is
        // no longer what these inputs generate.
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"renamed","organelles":{}}"#,
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));

        // A new gene is an input too.
        write_main_code(&root, EnvMode::Baked).unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::UpToDate { .. }));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(root.join("src/extra.gene.code"), "gene_name = \"extra\"\n").unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));
    }

    #[test]
    fn entry_status_spots_a_hand_edit_to_a_generated_file() {
        let root = stamped_project("status_edited");
        let entry = root.join("main.code");
        let text = fs::read_to_string(&entry).unwrap();
        fs::write(&entry, format!("{text}assert 1 = 1\n")).unwrap();
        assert!(
            matches!(entry_status(&root), EntryStatus::Edited),
            "an edited body no longer matches its stamp"
        );
    }

    #[test]
    fn entry_status_treats_a_pre_stamp_entry_as_stale() {
        let root = tmp_root("status_prestamp");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        // What an older euglena wrote: our header, no stamp line.
        fs::write(
            root.join("main.code"),
            format!(
                "{GENERATED_HEADER}\n\nemit EuglenaHasBeenBorn {{ cell_name = \"x\" }} to this\n"
            ),
        )
        .unwrap();
        assert!(matches!(entry_status(&root), EntryStatus::Stale));
    }

    #[test]
    fn entry_status_reports_why_it_cannot_verify() {
        let root = stamped_project("status_unverifiable");
        // Declare an organelle that was never installed: regeneration fails,
        // so freshness is unknowable rather than false.
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{"term":"console"}}"#,
        )
        .unwrap();
        match entry_status(&root) {
            EntryStatus::Unverifiable(e) => assert!(e.contains("console"), "got: {e}"),
            _ => panic!("a failing regeneration should be Unverifiable"),
        }
    }

    /// `{ module, config, setup }` as an `OrganelleEntry::Full`.
    fn full(reference: &str, config: serde_json::Value, setup: Option<&str>) -> OrganelleEntry {
        OrganelleEntry::Full {
            reference: reference.to_string(),
            config: config.as_object().cloned().unwrap_or_default(),
            setup: setup.map(str::to_string),
            hosted: None,
        }
    }

    fn one(name: &str, alias: &str, entry: OrganelleEntry) -> AppManifest {
        let mut map = BTreeMap::new();
        map.insert(alias.to_string(), entry);
        AppManifest {
            name: name.to_string(),
            organelles: map,
            genes: Vec::new(),
        }
    }

    /// A jwt organelle configured from `${…}`s, beside the env organelle a
    /// runtime-mode entry reads them through (ticket 170).
    /// Each test names its own variables (`prefix`): tests run in parallel
    /// and the process environment is shared.
    fn env_app(root: &Path, prefix: &str) -> AppManifest {
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "jwt":{"name":"jwt","version":"1.1.4","asset":"jwt-linux-x86_64.so","setup":"Config"},
                "env":{"name":"env","version":"1.1.4","asset":"env-linux-x86_64.so"}}}"#,
        )
        .unwrap();
        let mut m = one(
            "app",
            "auth",
            full(
                "jwt",
                serde_json::json!({
                    "secret": format!("${{{prefix}_SECRET}}"),
                    "issuer": format!("https://${{{prefix}_HOST}}:${{{prefix}_PORT}}/id"),
                    "ttl": 60
                }),
                None,
            ),
        );
        m.organelles.insert(
            "vars".to_string(),
            OrganelleEntry::Reference("env".to_string()),
        );
        m
    }

    #[test]
    fn runtime_mode_reads_config_variables_when_the_program_starts() {
        let root = tmp_root("cfg_runtime");
        let m = env_app(&root, "STAGING");
        std::env::set_var("STAGING_SECRET", "do-not-bake-me");
        let content = generate_main_code(&m, &[], &root, EnvMode::Runtime).unwrap();
        std::env::remove_var("STAGING_SECRET");
        assert!(!content.contains("do-not-bake-me"), "{content}");
        // Each variable is read once, through the declared env organelle,
        // and stops the program at start when it is unset.
        assert_eq!(
            content
                .matches("emit Require { name = \"STAGING_SECRET\" } to vars")
                .count(),
            1
        );
        assert!(content.contains("assert _env_read_STAGING_SECRET ∉ Exception"));
        // A whole value that is one variable keeps its kind; text around
        // variables makes text; a literal stays a literal.
        assert!(content.contains(
            "emit Config { issuer = \"\" + \"https://\" + _env_STAGING_HOST + \":\" + _env_STAGING_PORT + \"/id\", secret = _env_STAGING_SECRET, ttl = 60 } to auth get _cfg_auth"
        ), "{content}");
        // The reads come before the setup line that uses them.
        assert!(content.find("emit Require").unwrap() < content.find("emit Config").unwrap());
    }

    #[test]
    fn baked_mode_writes_config_variables_in_as_before() {
        let root = tmp_root("cfg_baked");
        let m = env_app(&root, "BAKED");
        std::env::set_var("BAKED_SECRET", "baked");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        std::env::remove_var("BAKED_SECRET");
        assert!(content.contains("secret = \"baked\""), "{content}");
        assert!(!content.contains("emit Require"), "{content}");
    }

    /// `env_app` with its env pinned at a version that takes `Config`.
    fn held_app(root: &Path, prefix: &str) -> AppManifest {
        let m = env_app(root, prefix);
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{
                "jwt":{"name":"jwt","version":"1.1.4","asset":"jwt-linux-x86_64.so","setup":"Config"},
                "env":{"name":"env","version":"2.19.0","asset":"env-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        m
    }

    #[test]
    fn a_held_build_reads_its_own_env_file_when_its_env_can() {
        let root = tmp_root("cfg_held");
        let m = held_app(&root, "HELD");
        std::env::set_var("HELD_SECRET", "do-not-bake-me");
        let content = generate_main_code(&m, &[], &root, EnvMode::Held).unwrap();
        std::env::remove_var("HELD_SECRET");
        assert!(!content.contains("do-not-bake-me"), "{content}");
        let file = root
            .canonicalize()
            .unwrap()
            .join(".env")
            .display()
            .to_string();
        let config = format!("emit Config {{ file = \"{file}\" }} to vars get _env_file");
        assert!(content.contains(&config), "{content}");
        // Pointed at the file before anything is read from it.
        assert!(content.find(&config).unwrap() < content.find("emit Require").unwrap());
        assert!(content.contains("secret = _env_HELD_SECRET"), "{content}");
    }

    #[test]
    fn a_held_build_names_the_real_env_file_behind_a_link() {
        // A build made in a folder of links to the application must name
        // the real file, not the link in a folder gone after the build.
        let root = tmp_root("cfg_held_link");
        let m = held_app(&root, "LINKED");
        let elsewhere = tmp_root("cfg_held_link_real");
        fs::create_dir_all(&elsewhere).unwrap();
        fs::write(elsewhere.join(".env"), "LINKED_SECRET=x\n").unwrap();
        std::os::unix::fs::symlink(elsewhere.join(".env"), root.join(".env")).unwrap();
        let content = generate_main_code(&m, &[], &root, EnvMode::Held).unwrap();
        let real = elsewhere
            .canonicalize()
            .unwrap()
            .join(".env")
            .display()
            .to_string();
        assert!(content.contains(&format!("file = \"{real}\"")), "{content}");
    }

    #[test]
    fn a_held_build_bakes_when_its_env_cannot_read_a_file() {
        // env pinned from before `Config`: reading would read the host's
        // environment, so the values are written in, as before.
        let root = tmp_root("cfg_held_old_env");
        let m = env_app(&root, "OLDENV");
        std::env::set_var("OLDENV_SECRET", "baked");
        let content = generate_main_code(&m, &[], &root, EnvMode::Held).unwrap();
        std::env::remove_var("OLDENV_SECRET");
        assert!(content.contains("secret = \"baked\""), "{content}");
        assert!(!content.contains("_env_file"), "{content}");
        // No env organelle at all: the same.
        let root = tmp_root("cfg_held_no_env");
        let mut m = held_app(&root, "NOENVHELD");
        m.organelles.remove("vars");
        let content = generate_main_code(&m, &[], &root, EnvMode::Held).unwrap();
        assert!(!content.contains("emit Require"), "{content}");
    }

    #[test]
    fn runtime_mode_without_an_env_organelle_says_what_to_declare() {
        let root = tmp_root("cfg_runtime_no_env");
        let mut m = env_app(&root, "NOENV");
        m.organelles.remove("vars");
        let err = generate_main_code(&m, &[], &root, EnvMode::Runtime).unwrap_err();
        assert!(err.contains("\"env\": \"env\""), "{err}");
    }

    #[test]
    fn generate_config_block_emits_the_modules_setup_particle() {
        let root = tmp_root("cfg_setup");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"jwt":{"name":"jwt","version":"1.1.4","asset":"jwt-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "auth",
            full("jwt", serde_json::json!({ "secret": "sh" }), None),
        );
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"jwt.so\" as auth"));
        assert!(content.contains("emit Config { secret = \"sh\" } to auth get _cfg_auth"));
    }

    #[test]
    fn generate_config_block_uses_http_server_listen() {
        let root = tmp_root("cfg_listen");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"http_server":{"name":"http_server","version":"1.1.4","asset":"http_server-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "srv",
            full("http_server", serde_json::json!({ "port": 9800 }), None),
        );
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("emit Config { port = 9800 } to srv get _cfg_srv"));
    }

    #[test]
    fn generate_empty_config_block_still_emits_setup() {
        let root = tmp_root("cfg_empty");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"fs":{"name":"fs","version":"1.1.4","asset":"fs-linux-x86_64.so","setup":"Config"}}}"#,
        )
        .unwrap();
        let m = one("app", "files", full("fs", serde_json::json!({}), None));
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("emit Config {} to files get _cfg_files"));
    }

    #[test]
    fn generate_config_on_a_stateless_module_errors() {
        let root = tmp_root("cfg_stateless");
        fs::create_dir_all(root.join(".code")).unwrap();
        fs::write(
            root.join(".code/lock.json"),
            r#"{"modules":{"crypto":{"name":"crypto","version":"1.1.4","asset":"crypto-linux-x86_64.so"}}}"#,
        )
        .unwrap();
        let m = one(
            "app",
            "c",
            full("crypto", serde_json::json!({ "cost": 12 }), None),
        );
        let err = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap_err();
        assert!(err.contains("stateless"), "should say why: {err}");
        assert!(err.contains("crypto"), "should name it: {err}");
    }

    #[test]
    fn generate_literal_path_config_needs_an_explicit_setup() {
        let root = tmp_root("cfg_literal");
        let no_setup = one(
            "app",
            "x",
            full("organelles/x.so", serde_json::json!({ "k": 1 }), None),
        );
        let err = generate_main_code(&no_setup, &[], &root, EnvMode::Baked).unwrap_err();
        assert!(
            err.contains("setup"),
            "should ask for a setup particle: {err}"
        );

        let with_setup = one(
            "app",
            "x",
            full(
                "organelles/x.so",
                serde_json::json!({ "k": 1 }),
                Some("Init"),
            ),
        );
        let content = generate_main_code(&with_setup, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("emit Init { k = 1 } to x get _cfg_x"));
    }

    #[test]
    fn generate_config_null_value() {
        let root = tmp_root("cfg_null");
        let m = one(
            "app",
            "auth",
            full(
                "organelles/auth.so",
                serde_json::json!({ "token": null }),
                Some("Config"),
            ),
        );
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("token = null"));
    }

    #[test]
    fn generate_reference_organelle_emits_no_setup() {
        let m = make_manifest("app", &[("logger", "organelles/console.so")]);
        let root = tmp_root("ref_no_setup");
        let content = generate_main_code(&m, &[], &root, EnvMode::Baked).unwrap();
        assert!(content.contains("link \"organelles/console.so\" as logger"));
        assert!(!content.contains("_cfg_"));
        assert!(!content.contains("emit Config"));
    }

    #[test]
    fn write_main_code_refuses_hand_written_file() {
        let root = tmp_root("refuse_overwrite");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        fs::write(root.join("main.code"), "| hand-written\nassert 1 = 1\n").unwrap();
        let err = write_main_code(&root, EnvMode::Baked).unwrap_err();
        assert!(err.contains("already exists"), "got: {err}");
    }

    #[test]
    fn write_main_code_overwrites_generated_file() {
        let root = tmp_root("overwrite_generated");
        fs::write(
            root.join("manifest.json"),
            r#"{"name":"x","organelles":{}}"#,
        )
        .unwrap();
        fs::write(
            root.join("main.code"),
            format!("{GENERATED_HEADER}\nold content\n"),
        )
        .unwrap();
        write_main_code(&root, EnvMode::Baked).unwrap();
        let content = fs::read_to_string(root.join("main.code")).unwrap();
        assert!(content.contains("emit EuglenaHasBeenBorn { cell_name = \"x\" } to this"));
        assert!(!content.contains("old content"));
    }
}
