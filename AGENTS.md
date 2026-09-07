# Working on `euglena`

Guidance for AI agents (Codex, Claude Code, anything else) working in this
repository. `README.md` documents the CLI; this file documents *working on* it.

---

## What this repo is

The euglena CLI: the **cell model** on top of the `code` language. It owns
manifests, genes, codegen, module (organelle) installation, doctor, and
delegation to `code`. It is a thin, deliberately dependency-poor tool —
clap + serde_json only, which is why `src/sha256.rs` exists rather than a crate.

```sh
cargo build --release      # target/release/euglena
cargo test
```

The `code` binary it delegates to is discovered, not vendored. For tests, point
`EUGLENA_TEST_CODE_BIN` at a **fresh** build — prefer `code/target/debug/code`;
the release binary in that repo is often stale.

---

## The layer boundary — the whole point of this repo

**`code` is the language. `euglena` is the cell model. `code` must stay
ignorant of euglena.**

`code` has no cells, no genes and **no organelles** — the language says
*module*. That word had drifted downward once and 1.8.0 purged it: the
runtime-link address is `{ _module }`, a host is asked `Module`, not
`Organelle`. euglena keeps "organelle" — it is euglena's word — and simply
stops expecting the layer below to know it.

`README.md` carries a "what is euglena's, and what is `code`'s" table. Keep it
honest; it is the spec for this boundary.

The same rule killed an earlier design: `Hosted` ("is a host holding me?") was
the upper layer's question wearing the lower layer's clothes. The right question
was `Linked` — "is this run a module somebody linked, or is it the program?" —
answerable from the build target alone, with no runtime state and nobody
required to be present.

---

## The generated entry, and its stamp

`euglena run` / `build` / `test` generate `main.code` from `manifest.json` plus
`src/*.gene.code`. It is **generated, never hand-edited**. Line 2 carries a
stamp — `| euglena <ver> · body sha256:<hex>`, a digest of everything below it —
so `doctor` can distinguish three states:

- **up to date**
- **STALE** — inputs moved; the next run fixes it
- **EDITED BY HAND** — body ≠ stamp. The only one that fails doctor, because the
  next run will destroy the edit.

`run` and `build` **require** a manifest; the old silent passthrough to `code` is
gone, and the check runs *before* interpreter discovery.

**Ordering matters in codegen:** setup (`Config`) particles are emitted **before**
gene links. A gene's keep-alive or door-opening code runs at link time, so a
stateful organelle must already be configured by then.

Tests that pin all of this: `tests/entry_drift.rs`, `tests/delegation.rs`,
`tests/scaffold.rs`, `tests/code_discovery.rs` (whose fixtures are real apps).

---

## Version floors

`MIN_CODE_VERSION` in `src/exec.rs` is currently **(1, 8, 0)** — the first
release that speaks the entry euglena writes. `exec::VersionNeed` takes the max
of that baseline, an optional per-command floor, and the manifest's own ask, and
the error message says **which of the three** raised the bar.

Two per-command floors (`MIN_CODE_VERSION_FOR_TEST`, `..._FOR_UNINSTALL`) were
deleted when the baseline passed them; the `command_floor` parameter stays for
future use. `manifest.json`'s `"code"` field accepts a **minimum only** —
`^`, `~` and ranges are refused by name in `manifest::parse_version_req`.

A hard-won ordering bug, already fixed, worth not reintroducing: `uninstall`
must resolve the `code` binary and compute orphaned-ness **before** writing the
manifest. Otherwise a version refusal leaves the alias gone and the bytes
installed. `references_module` must also scan `mock-organelles`, so uninstalling
a real alias does not delete bytes mock mode still needs.

---

## Vocabulary

`install` / `uninstall` / `list` — matching `code` exactly. The old `add` /
`remove` / `ls` spellings never shipped from here. In `code` the rename was
hard (old spellings are `unknown command`, no aliases).

`euglena install` with no name installs everything the manifest already names.
A first-party module missing from the pinned release is reported as
uninstallable — for `guest` that is **expected and correct**, since it is
unreleased and apps pin it with `"source": "local"` in `.code/lock.json`.
Installing must leave such entries alone.

---

## Testing gotchas that have actually bitten

- **A test that reads what another test wrote is not a passing test.** Six tests
  once took their fixtures from a *different* test binary's output directory.
  Green locally, where an earlier run had left the files; red on CI, where the
  suites start together.
- **Stale test artifacts lie.** A cached test binary had `CARGO_BIN_EXE_euglena`
  baked in from when this directory was named `euglena-cli`, so it spawned a
  path that no longer existed. `touch tests/<file>.rs` or `cargo clean -p` fixes
  it. The failure looked like a real ENOENT bug and was not.
- `code test` **interprets only, never builds** — deliberate. Parity between
  `run` and `build` is the language suite's property to prove, not an app's; app
  fixtures assert app logic and may assume it. Recorded in `code`'s own
  `cmd_test` doc comment and README so it does not get "fixed" later.
  `euglena test` is now pure delegation — `exec::test` → regenerate entry →
  `code test`. The old `src/testrunner.rs` is deleted.

---

## How we work here

- **Finish, commit, push.** Standing authorisation from the owner — do not ask
  each time. Cutting a release is the exception: say it out loud first.
- Commit messages are prose and say *why*, in the voice of the existing log.
- `-v/--verbose` on `run`/`build`/`test` prints the generated entry's gene and
  organelle counts plus the exact delegated `code` command. Use it when a
  delegation looks wrong instead of guessing.
- Open work is tracked in `docs/tickets/`.

### Two agents at once

Codex and Claude Code may be working these repos simultaneously.

- **Announce your lane** in your first commit: which subsystem, which files.
- **Pull before you start and before you push.** These repos are normally clean
  and pushed, so an unexpected conflict means the other agent is mid-flight.
- Prefer many small pushed commits over one long dirty tree.
- A change here can break every app in `my-euglena-apps` at once, since they all
  run through this codegen. Before pushing anything that touches `codegen.rs`,
  `manifest.rs` or `exec.rs`, rebuild at least `ping-api` and `ping-web` in that
  repo — they are the smallest end-to-end pair.
