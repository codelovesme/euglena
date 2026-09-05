# euglena

The `euglena` CLI — scaffold, run, and build [Euglena](https://github.com/codelovesme)
applications. Euglena apps are written in the [Code](https://github.com/codelovesme/code)
language (**requires code >= 1.8.0**); this CLI is a thin cell layer on top
of the `code` toolchain: a `manifest.json` cell definition, `*.gene.code`
genes that auto-link, organelle `config` blocks, and mock mode. Everything else — the
project marker, the module installer and its lockfile, `format`, `test` — is
`code`'s own, and euglena wraps it rather than duplicating it.

## What is euglena's, and what is `code`'s

| | `code` | `euglena` |
|---|---|---|
| the language, the interpreter, the LLVM backend | ✔ | delegates |
| installing modules, `.code/lock.json` | ✔ | wraps as `install`/`uninstall` |
| `format` | ✔ | delegates |
| `test` — the `tests/` walk, the `fail_` convention | ✔ | delegates |
| the cell model: `manifest.json`, `*.gene.code`, organelle aliases, mock mode | — | ✔ |
| generating `main.code` from those | — | ✔ |

Your Euglena app **is** a `code` project, and nothing here fences it off:
`code list`, `code format`, `code build main.code --target wasm`, reading the
generated entry to see what your manifest and genes actually compile to —
all of it works, and reading `main.code` is the fastest way to learn the
language underneath.

Only `run`, `build` and `test` should go through euglena, because only
euglena knows to regenerate the entry first. In a directory with no
`manifest.json` they don't even try — see
[run and build need a manifest](#run-and-build-need-a-manifest).

## Install

The recommended way is via [`cdlvsm`](https://github.com/codelovesme/cdlvsm-cli),
the package manager for codelovesme CLI tools:

```bash
cdlvsm install euglena
cdlvsm install code      # euglena runs apps through the code interpreter
```

This gives you `cdlvsm euglena <command>` (dispatched through `cdlvsm`) — by
design there's **no bare `euglena` command** unless you pass `--link`:

```bash
cdlvsm install euglena --link   # also get a bare `euglena` on PATH
```

Or install directly from a release, which does put a bare `euglena` on PATH:

```bash
curl -sSf https://raw.githubusercontent.com/codelovesme/euglena/main/install.sh | sh
```

Linux x86_64 only, for now. Examples below use `cdlvsm euglena` — drop the
`cdlvsm ` prefix if you installed with `--link` or `install.sh`.

## Usage

```
cdlvsm euglena init <name>              scaffold a new app in ./<name>
cdlvsm euglena run [app]                run the app (default: this directory)
cdlvsm euglena build [app] [options]    compile to a native binary (or a module)
cdlvsm euglena test                     run this project's fixtures (wraps `code test`)
cdlvsm euglena format [--check] [path...]   the canonical layout (wraps `code format`)
cdlvsm euglena install <name> [--as <alias>]  install an organelle, declare it in the manifest
cdlvsm euglena uninstall <alias>        drop the alias, and the module if unreferenced
cdlvsm euglena list                     declared organelles, and whether each is installed
cdlvsm euglena doctor                   check the interpreter, project, and organelles
cdlvsm euglena code set <path>          point euglena at a specific `code` binary
cdlvsm euglena code show
cdlvsm euglena code clear
```

`run`, `build` and `test` all take `-v` / `--verbose`, which prints the
generated entry and the exact `code` command euglena hands it to.

```
build options:
  -r, --release                         -O2; the default is unoptimized
  -t, --target exe|shared|static|wasm   default exe — shared/static make this cell
                                         linkable as another cell's organelle
  -o, --output <path>                   where to write it (default: build/<name>)
```

```bash
cdlvsm euglena init app
cd app
cdlvsm euglena run    # just works — no code-path setup needed, see below
```

### Finding `code`

`run`/`build`/`test`/`format`/`install`/`uninstall` shell out to the `code`
interpreter. euglena finds it automatically: if you haven't pinned a path,
it uses cdlvsm's `cdlvsm-code` shim from your `PATH` — no extra setup needed
after `cdlvsm install code`. Either way it's version-checked: euglena
generates syntax that only parses on **code >= 1.8.0**, so a stale binary is
refused by name up front rather than failing as a parse error partway
through a generated file. `euglena doctor` reports what was found and why.

It deliberately looks only for `cdlvsm-code`, never a bare `code` — on Linux
`code` is VS Code's own CLI, and euglena won't risk invoking that.

If your `code` came from somewhere other than cdlvsm (a direct `install.sh`,
a dev build, `cdlvsm install code --link`), point euglena at it explicitly
(stored in `~/.config/euglena-cli/code_binary_path`):

```bash
cdlvsm euglena code set /path/to/your/code
cdlvsm euglena code show      # what's configured
cdlvsm euglena code clear     # go back to cdlvsm-code discovery
```

### App layout

`euglena init myapp` creates:

```
myapp/
  manifest.json          cell name + organelles
  src/nucleus.gene.code  boot gene (any src/*.gene.code is auto-linked)
  tests/nucleus.code     a starter fixture for `euglena test`
  .code/lock.json        marks the project root — where `install` installs into
  .gitignore             .code/modules/, main.code, build/
  main.code              GENERATED on first run/build/test — not written by init
```

`main.code` is regenerated from `manifest.json` + `src/*.gene.code` on every
`run`/`build`/`test` and gitignored; euglena refuses to touch one that
doesn't carry its `| GENERATED` header, so a hand-written entry is never at
risk.

Its second line is a **stamp** — the euglena that wrote the file, and the
SHA-256 of everything below:

```
| GENERATED — do not edit. Modify manifest.json or src/*.gene.code instead.
| euglena 0.2.0 · body sha256:1f0c…
```

The header says euglena owns the file; the stamp is what lets `euglena
doctor` tell apart the two states it can't:

- **stale** — the entry still matches its own stamp, but `manifest.json`,
  a gene, or `.code/lock.json` has moved on since. Harmless: the next
  `run`/`build`/`test` regenerates it. Worth reporting because a plain
  `code run .` in that directory would quietly execute the *old* entry.
- **edited by hand** — the body no longer matches its stamp, so someone
  changed a generated file and the next `run`/`build`/`test` will throw
  that work away. This one fails `doctor`; move the change into
  `manifest.json` or a gene.

### run and build need a manifest

`run` and `build` are for cells. In a directory with no `manifest.json`
they stop and point at `code` rather than passing the path through — a
plain `code` project or a lone `.code` file is `code`'s job, and
`euglena run` being a second spelling of `code run` on some inputs but not
others helped nobody:

```
$ cdlvsm euglena run
euglena: '.' is not a Euglena app — no manifest.json in /home/you/scratch.

euglena runs and builds cells: manifest.json + src/*.gene.code.
For a plain code project or a lone .code file, use code directly:
  cdlvsm code run .
To make this directory a Euglena app: cdlvsm euglena init <name>
```

The other direction stays open, and is worth using: a Euglena app **is** a
`code` project. `code list`, `code format`, reading `main.code` to see what
your manifest and genes actually compile to — all of it works. Only
`run`/`build` should go through euglena, so the entry is regenerated first.

### Organelles

An organelle is a `code` native module, declared in `manifest.json` by
**module name** — not a path:

```json
{
  "name": "myapp",
  "organelles": {
    "term": "terminal",
    "srv": { "module": "http_server", "config": { "port": "${PORT}" } }
  }
}
```

```bash
cdlvsm euglena install terminal        # code install terminal, then declares "terminal": "terminal"
cdlvsm euglena install http_server --as srv
cdlvsm euglena list                    # each alias, and whether it's installed
cdlvsm euglena uninstall srv           # the ALIAS — `code uninstall` is the one taking a module name
```

`install` fetches the module via `code install` (bytes land in this project's
`.code/modules/`, pinned by sha256 in `.code/lock.json`) and records the
alias. At generate time euglena checks the module name against that lockfile
and writes `link "<name>.<ext>" as <alias>` — `link "terminal.so" as term`,
not the platform-suffixed asset `code install` laid down
(`terminal-linux-x86_64.so`). `code`'s loader maps the tidy spelling back to
the pinned asset through the same lockfile. A declared organelle with no lock
entry fails generation with the fix: `euglena install <name>`.

`install` / `uninstall` / `list` are `cdlvsm`'s and `code`'s three words, on
purpose — one vocabulary across the family. What differs is the argument, and
it has to: `code uninstall` takes a module name, `euglena uninstall` takes the
alias the manifest is keyed by and `euglena list` prints. `uninstall` needs
**code >= 1.3.0**, the release those names landed in.

A reference containing `/` or ending `.so`/`.code` is treated as a literal
path instead — an escape hatch for a vendored or locally-built organelle.

A `config` block, if given, becomes `emit <Setup> { … } to <alias> get
_cfg_<alias>` right after the links — where `<Setup>` is the particle the
module names for its configuration (`Config` for most, `Listen` for
`http_server`), read from its `module.json` via `.code/lock.json`. A
`config` block on a *stateless* module (`crypto`, `strings`, …) is a
generation error — those take their parameters per call. A literal-path
organelle names its own setup particle in the entry (`"setup": "Config"`),
since there is no lockfile row to read.

### One app, held or alone

An application that may be run on its own **or** held inside a host has one
thing it cannot settle at build time: its door. Alone it opens a port; held
it must not, because a thread that outlives the application cannot be
unloaded, and an application that cannot be unloaded never gives its memory
back.

`"hosted"` names the stand-in to link instead when it turns out to be held:

```json
"organelles": {
  "net": { "module": "net_server", "hosted": "membrane",
           "config": { "port": "${PORT}" } }
}
```

One manifest, one build, both lives. The alias is the same, the particles are
the same, the `config` block is the same — **no gene changes anything**. Only
the organelle behind the name differs, and euglena picks it while the
application starts, by asking `code` whether a host is holding it.

Both sides have to answer the same setup particle, since one `config` block
is emitted for whichever gets linked; a mismatch is a generation error rather
than a surprise in whichever of the two lives you did not test.

Needs **code >= 1.8.0** — see [Requiring a `code` version](#requiring-a-code-version).

`${VAR}` in a `config` value interpolates from the environment (loaded from
a `.env` file next to `manifest.json`, if present) — so secrets stay out of
version control. `EUGLENA_MOCK_MODE=true` (optionally scoped with
`EUGLENA_MOCK_TYPES=type1,type2`) overlays a `mock-organelles` block onto
`organelles` in memory, for local/test runs — nothing here has an
equivalent in `code` itself.

## Requiring a `code` version

euglena refuses a `code` older than **1.8.0**, because that is what the
syntax it *generates* needs. What your *app* needs is a different question —
a module handler, a field, a particle that only exists from some version on —
and it is the app's to state:

```json
{
  "name": "myapp",
  "code": ">=1.5.0",
  "organelles": { "srv": { "module": "http_server", "config": { "port": "${PORT}" } } }
}
```

`run`, `build` and `test` then refuse anything below **the higher** of
euglena's own baseline and this field, and the error says which of the two
asked, since the fix differs:

```
euglena: found Code v1.8.0 at '/home/you/.local/bin/cdlvsm-code',
but this needs >= v1.9.0, which is what this app's manifest.json asks for.
```

(There is a third input — a floor for a subcommand newer than the baseline —
but nothing needs one today: the 1.8.0 baseline is above every version that
introduced a command euglena delegates to.)

Only a minimum is expressible — `"1.5.0"` and `">=1.5.0"` mean the same
thing, and carets, tildes and ranges are refused by name. A `code`
requirement only ever moves forward, so the other spellings would describe a
situation that does not arise.

## Building from source

```bash
cargo build --release    # ./target/release/euglena
cargo test
```

Depends only on `clap` and `serde_json` — no LLVM, no build-time dependency
on the `code` language (it invokes the `code` binary at runtime). The
real-run integration tests are gated behind `EUGLENA_TEST_CODE_BIN=/path/to/code`
(CI has no `code`); point it at a `code` >= 1.8.0 binary to run them.

## License

GPL-3.0-or-later — see [LICENSE](./LICENSE).
