use std::fs;
use std::path::Path;

use crate::invocation::command_prefix;

/// Scaffold a new Euglena project in a directory named `name`.
///
/// `web` scaffolds one that runs in a browser instead of on a machine. The
/// difference is small on purpose: a manifest that says so, a page to load
/// the module into, and a gene that draws instead of one that answers. What
/// it deliberately does *not* write is the page's half of the browser
/// modules — `code build --target wasm` emits that beside the module it
/// built, because it is output rather than source. Scaffolding it would be
/// handing the application a copy to keep in step with a runtime it does not
/// control, and a copy that falls behind fails in the browser, at a distance
/// from the change that broke it.
pub fn run(name: &str, web: bool) {
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
    fs::write(project.join("manifest.json"), manifest_template(name, web))
        .expect("failed to write manifest.json");

    // Write a starter nucleus gene.
    fs::write(
        project.join("src/nucleus.gene.code"),
        if web {
            web_gene_template()
        } else {
            nucleus_gene_template()
        },
    )
    .expect("failed to write src/nucleus.gene.code");

    if web {
        // The page: the application's own, and the only part of a browser
        // build it is expected to edit — its title, where the module draws,
        // anything else it wants to load.
        fs::create_dir_all(project.join("web")).expect("failed to create web/");
        fs::write(project.join("web/index.html"), index_html_template(name))
            .expect("failed to write web/index.html");
    }

    // Empty lockfile — marks the project root for `code install`/`link`.
    fs::write(project.join(".code/lock.json"), "{\n  \"modules\": {}\n}\n")
        .expect("failed to write .code/lock.json");

    // A starter test fixture so `euglena test` has something to say.
    //
    // Not for a browser app, which has nothing it could say yet: its genes
    // emit to organelles that exist as archives, `code test` interprets, and
    // an archive is linked by a build or not at all. The modules do have
    // machine builds that answer "there is no page here" — that is what they
    // are for — but a project pins one artifact per module, so an app cannot
    // hold the archive it ships and the library it would test against. A
    // fixture that tested nothing would be worse than none.
    if !web {
        fs::write(project.join("tests/nucleus.code"), test_fixture_template())
            .expect("failed to write tests/nucleus.code");
    }

    fs::write(project.join(".gitignore"), gitignore_template(web))
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
    if web {
        println!("  {cmd} install                        (the organelles, for the browser)");
        println!("  {cmd} build --target wasm -o web/{name}.wasm");
        println!("  python3 -m http.server --directory web");
        println!();
        println!("`code build` writes web/host.mjs beside the module — the page's half of");
        println!("the browser organelles. It is output: ignored, and rewritten every build.");
        println!();
        println!("No starter fixture: a browser app's organelles are archives, and `{cmd} test`");
        println!("interprets rather than builds, so it cannot link them yet.");
    } else {
        println!("  {cmd} run   (needs a `code` interpreter on PATH — e.g. `cdlvsm install code`)");
    }
    println!();
    println!("Add more genes as src/*.gene.code — euglena-cli links them automatically.");
    println!("Add an organelle: {cmd} install <name>   (fetches it via `code install` and");
    println!("declares it in manifest.json).");
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

fn manifest_template(name: &str, web: bool) -> String {
    // `runtime` is what tells `euglena install` which bytes to fetch: a page
    // cannot open a `.so`, so a browser app gets the archive that links in.
    // A manifest that says nothing means a machine, which is what every app
    // said before there was a second answer.
    let (runtime, organelles) = if web {
        ("web", "\n    \"dom\": \"dom\"\n  ")
    } else {
        ("native", "")
    };
    format!(
        r#"{{
  "name": "{name}",
  "title": "{name}",
  "description": "A new Euglena application.",
  "runtime": "{runtime}",
  "organelles": {{{organelles}}}
}}
"#
    )
}

/// Every construct here needs nothing installed — `code run` works with a
/// bare `code install`-free project, and the nucleus gene should too.
fn nucleus_gene_template() -> &'static str {
    r#"| Nucleus gene — the cell's boot handler.
|
| Any src/*.gene.code file is linked into the app automatically. Handlers
| defined here join one program-wide dispatch table, so a gene is just a
| file that answers particles.

gene_name = "nucleus"

EuglenaHasBeenBorn { cell_name } =>
    return Alive { cell_name = cell_name }
"#
}

/// A gene that draws instead of one that answers.
///
/// It draws on being born and redraws on being clicked, which is the whole
/// shape of a browser application here: state at the top of the file, one
/// handler that builds the page from it, and events that change the state
/// and ask for the page again.
fn web_gene_template() -> &'static str {
    r##"| Nucleus gene — the cell's boot handler, and the page.
|
| Any src/*.gene.code file is linked into the app automatically. Handlers
| defined here join one program-wide dispatch table, and they see this file's
| top level — which is where an application's own state belongs.

clicks = 0

EuglenaHasBeenBorn { cell_name } =>
    emit Draw { title = cell_name } to this get drawn
    return Alive { cell_name = cell_name }

| A click is a particle: the tree says what it means, the page sends it back,
| and this handler answers it like any other.
Clicked { } =>
    clicks = clicks + 1
    emit Draw { title = "clicked" } to this get _
    return Counted { clicks = clicks }

| Everything the reader sees, rebuilt from `clicks`. Nothing is reached for
| and nothing is patched, so what is shown cannot drift from what is held.
Draw { title } =>
    emit Render {
        into = "#app",
        styles = {
            ".card" = { font = "16px system-ui, sans-serif", padding = "2rem" }
        },
        tree = {
            tag = "div",
            attrs = { class = "card" },
            children = [
                { tag = "h1", children = [title] },
                { tag = "p", children = ["clicked $clicks times"] },
                { tag = "button", on = { click = "Clicked" }, children = ["click me"] }
            ]
        }
    } to dom get r
    return Drawn { ok = r.ok }
"##
}

/// The page. Four lines, because everything else it would have done is in
/// the module or in the half `code build` writes beside it.
fn index_html_template(name: &str) -> String {
    format!(
        r#"<!doctype html>
<meta charset="utf-8">
<title>{name}</title>
<div id="app"></div>
<script type="module">
import {{ runWasm }} from './host.mjs';
await runWasm('{name}.wasm');
</script>
"#
    )
}

fn test_fixture_template() -> &'static str {
    r#"| A starter fixture for `euglena test`. Fixtures run in place, from
| tests/, so a gene under src/ is linked with a relative path.

link "../src/nucleus.gene.code"

emit EuglenaHasBeenBorn { cell_name = "test" } to this get born
assert born ∈ Alive
assert born.cell_name = "test"
"#
}

fn gitignore_template(web: bool) -> String {
    let mut text = String::from(
        r#"# Installed organelle binaries, and installed genes. .code/lock.json
# (committed) pins what they are, so a checkout can reproduce both with
# `euglena install`.
.code/modules/
.code/genes/

# Generated from manifest.json + src/*.gene.code on every run/build/test.
main.code

# Where `euglena build` puts artifacts.
build/
"#,
    );
    if web {
        text.push_str(
            r#"
# The module, and the page's half of the browser organelles that `code build`
# writes beside it. Both are output: rebuilt from the genes and the manifest,
# and the half is only ever as new as the runtime it answers because the same
# build wrote them.
web/*.wasm
web/host.mjs
"#,
        );
    }
    text
}
