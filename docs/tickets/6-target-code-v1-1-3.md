# 6 — Target code v1.1.3, and refuse anything older

- **Priority:** High
- **Type:** Compatibility
- **Area:** `src/exec.rs` (`is_code_interpreter`, `find_code_binary_or_exit`), `tests/code_discovery.rs`

## Context

euglena 0.1.5 targets `code` v0.4.x. The released language is **v1.1.3**, and
the gap is not incremental — comments, particle declarations, handler field
lists, `link`, module resolution and the CLI's own subcommands all moved.
Running a 0.1.5-scaffolded app against v1.1.3 fails at the first line of the
nucleus gene.

Worse, the chain is broken before that: the `cdlvsm-code` shim on a current
machine is a v0.4-era binary that does not understand `--version` (status 1,
empty stdout), so [`is_code_interpreter`](../../src/exec.rs) rejects it and
`euglena run` reports "no Code interpreter found". Verified 2026-08-30.

v1.1.3 prints `Code v1.1.3`, so the existing guard's *shape* is right — only
its permissiveness is wrong. It accepts any `Code v…`, including the v0.4
binaries that cannot run anything this repo now generates.

## Change

- Parse the `Code vX.Y.Z` line into a version, not just a prefix match.
- Require **>= 1.1.0**. Below that, exit with a message naming the found
  version and telling the user to `cdlvsm install code` — a silent parse
  error twenty lines into a generated file is the failure mode this replaces.
- Keep the "only `cdlvsm-code`, never a bare `code`" rule from T4 unchanged;
  on Linux a bare `code` is VS Code.
- Record the pinned target in one place (a `const MIN_CODE_VERSION`), so the
  README and the error text cannot drift from the check.

## Verify

- `tests/code_discovery.rs`: a fake shim printing `Code v0.4.1` is refused
  with a message naming 1.1.0; one printing `Code v1.1.3` is accepted; one
  that fails `--version` is still refused.
- Gated real-run tests take `EUGLENA_TEST_CODE_BIN`; point it at a v1.1.3
  tarball binary (`gh release download v1.1.3 --repo codelovesme/code`).
