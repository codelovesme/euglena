# euglena

The `euglena` CLI — scaffold, run, and build [Euglena](https://github.com/codelovesme)
applications. Euglena apps are written in the [Code](https://github.com/codelovesme/code)
language (**requires code >= 1.1.0**); this CLI is a thin cell layer on top
of the `code` toolchain: a `manifest.json` cell definition, `*.gene.code`
genes that auto-link, Sap config, and mock mode. Everything else — the
project marker, the module installer and its lockfile, `format` — is
`code`'s own, and euglena wraps it rather than duplicating it.

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
cdlvsm euglena run [path]               run the app (default: this directory)
cdlvsm euglena build [path] [options]   compile to a native binary (or a module)
cdlvsm euglena test                     run every tests/*.code fixture, in place
cdlvsm euglena format [--check] [path...]   the canonical layout (wraps `code format`)
cdlvsm euglena add <name> [--as <alias>]    install an organelle, declare it in the manifest
cdlvsm euglena remove <alias>           drop the alias, and the module if unreferenced
cdlvsm euglena ls                       declared organelles, and whether each is installed
cdlvsm euglena doctor                   check the interpreter, project, and organelles
cdlvsm euglena code set <path>          point euglena at a specific `code` binary
cdlvsm euglena code show
cdlvsm euglena code clear
```

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

`run`/`build`/`test`/`format`/`add`/`remove` shell out to the `code`
interpreter. euglena finds it automatically: if you haven't pinned a path,
it uses cdlvsm's `cdlvsm-code` shim from your `PATH` — no extra setup needed
after `cdlvsm install code`. Either way it's version-checked: euglena
generates syntax that only parses on **code >= 1.1.0**, so a stale binary is
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
  .code/lock.json        marks the project root — where `add` installs into
  .gitignore             .code/modules/, main.code, build/
  main.code              GENERATED on first run/build/test — not written by init
```

`main.code` is regenerated from `manifest.json` + `src/*.gene.code` on every
`run`/`build`/`test` and gitignored; euglena refuses to touch one that
doesn't carry its `-- GENERATED` header, so a hand-written entry is never at
risk.

### Organelles

An organelle is a `code` native module, declared in `manifest.json` by
**module name** — not a path:

```json
{
  "name": "myapp",
  "organelles": {
    "term": "terminal",
    "srv": { "module": "http_server", "sap": { "port": "${PORT}" } }
  }
}
```

```bash
cdlvsm euglena add terminal            # code install terminal, then declares "terminal": "terminal"
cdlvsm euglena add http_server --as srv
cdlvsm euglena ls                      # each alias, and whether it's installed
```

`add` fetches the module via `code install` (bytes land in this project's
`.code/modules/`, pinned by sha256 in `.code/lock.json`) and records the
alias. At generate time euglena resolves the module name against that
lockfile to the exact asset `code install` laid down (platform-suffixed,
e.g. `terminal-linux-x86_64.so`) and writes `link "<asset>" as <alias>`. A
declared organelle with no lock entry fails generation with the fix:
`euglena add <name>`.

A reference containing `/` or ending `.so`/`.code` is treated as a literal
path instead — an escape hatch for a vendored or locally-built organelle.

A `sap` block, if given, becomes `emit Sap { … } to <alias>` right after the
links — one line per organelle, config and readiness in one round trip.
`${VAR}` in a `sap` value interpolates from the environment (loaded from a
`.env` file next to `manifest.json`, if present) — so secrets stay out of
version control. `EUGLENA_MOCK_MODE=true` (optionally scoped with
`EUGLENA_MOCK_TYPES=type1,type2`) overlays a `mock-organelles` block onto
`organelles` in memory, for local/test runs — nothing here has an
equivalent in `code` itself.

## Building from source

```bash
cargo build --release    # ./target/release/euglena
cargo test
```

Depends only on `clap` and `serde_json` — no LLVM, no build-time dependency
on the `code` language (it invokes the `code` binary at runtime). The
real-run integration tests are gated behind `EUGLENA_TEST_CODE_BIN=/path/to/code`
(CI has no `code`); point it at a `code` >= 1.1.0 binary to run them.

## License

GPL-3.0-or-later — see [LICENSE](./LICENSE).
