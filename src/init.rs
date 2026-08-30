use std::fs;
use std::path::Path;

use crate::invocation::command_prefix;

/// Scaffold a new Euglena project in a directory named `name`.
pub fn run(name: &str) {
    let project = Path::new(name);

    if project.exists() {
        eprintln!("euglena: directory '{}' already exists", name);
        std::process::exit(1);
    }

    // Create directory layout
    fs::create_dir_all(project.join("src")).expect("failed to create src/");
    fs::create_dir_all(project.join("tests")).expect("failed to create tests/");
    // `.code/` marks the project root — what `link` walks up to find
    // installed modules, and where `code install` puts them. Without it,
    // an `add` run inside a scaffolded app would resolve against whatever
    // ancestor directory happens to have a `.code/` of its own.
    fs::create_dir_all(project.join(".code")).expect("failed to create .code/");

    // Write manifest.json — the single source of truth for cell name + organelles.
    fs::write(project.join("manifest.json"), manifest_template(name))
        .expect("failed to write manifest.json");

    // Write a starter nucleus gene.
    fs::write(
        project.join("src/nucleus.gene.code"),
        nucleus_gene_template(),
    )
    .expect("failed to write src/nucleus.gene.code");

    // Empty lockfile — marks the project root for `code install`/`link`.
    fs::write(project.join(".code/lock.json"), "{\n  \"modules\": {}\n}\n")
        .expect("failed to write .code/lock.json");

    // A starter test fixture so `euglena test` has something to say.
    fs::write(project.join("tests/nucleus.code"), test_fixture_template())
        .expect("failed to write tests/nucleus.code");

    fs::write(project.join(".gitignore"), gitignore_template())
        .expect("failed to write .gitignore");

    println!("Created Euglena app '{}'", name);
    println!();
    println!(
        "  {}/manifest.json          <- cell name and organelles",
        name
    );
    println!(
        "  {}/src/nucleus.gene.code  <- boot gene (auto-detected)",
        name
    );
    println!();
    let cmd = command_prefix();
    println!("Next steps:");
    println!("  cd {}", name);
    println!("  {cmd} run   (needs a `code` interpreter on PATH — e.g. `cdlvsm install code`)");
    println!();
    println!("Add more genes as src/*.gene.code — euglena-cli links them automatically.");
    println!("Add an organelle: {cmd} add <name>   (fetches it via `code install` and");
    println!("declares it in manifest.json).");
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

fn manifest_template(name: &str) -> String {
    format!(
        r#"{{
  "name": "{name}",
  "title": "{name}",
  "description": "A new Euglena application.",
  "organelles": {{}}
}}
"#,
        name = name
    )
}

/// Every construct here needs nothing installed — `code run` works with a
/// bare `code install`-free project, and the nucleus gene should too.
fn nucleus_gene_template() -> &'static str {
    r#"-- Nucleus gene — the cell's boot handler.
--
-- Any src/*.gene.code file is linked into the app automatically. Handlers
-- defined here join one program-wide dispatch table, so a gene is just a
-- file that answers particles.

export let gene_name = "nucleus"

EuglenaHasBeenBorn { cell_name } => {
    return Alive { cell_name = cell_name }
}
"#
}

fn test_fixture_template() -> &'static str {
    r#"-- A starter fixture for `euglena test`. Fixtures run in place, from
-- tests/, so a gene under src/ is linked with a relative path.

link "../src/nucleus.gene.code"

emit EuglenaHasBeenBorn { cell_name = "test" } to this get born
assert born ∈ Alive
assert born.cell_name = "test"
"#
}

fn gitignore_template() -> &'static str {
    r#"# Installed organelle binaries. .code/lock.json (committed) pins what
# they are, so a checkout can reproduce them with `euglena add`.
.code/modules/

# Generated from manifest.json + src/*.gene.code on every run/build/test.
main.code

# Where `euglena build` puts artifacts.
build/
"#
}
