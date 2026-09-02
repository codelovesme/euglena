# 17 — Release 0.2.0

- **Priority:** Medium
- **Type:** Release
- **Area:** `Cargo.toml`, `install.sh`, `.github/workflows/`

## Context

This migration changes the app layout (a generated `main.code` at the root,
a `.code/` marker), the manifest schema (organelles are module names, not
paths) and the CLI surface (`add`/`remove`/`ls`/`format`, a `test` that
works, `build --target`). Nothing scaffolded by 0.1.x survives it. That is a
minor bump on a 0.x line, and it should be announced as breaking rather than
slipped in as a patch.

## Change

- `Cargo.toml` → `0.2.0`.
- Release notes stating plainly: **requires `code` >= 1.1.0**, and a 0.1.x
  app must be re-scaffolded (or hand-migrated per T7/T10/T11).
- Release notes must also carry T18: the organelle commands are
  `install` / `uninstall` / `list`, and `uninstall` needs **`code` >= 1.3.0**
  (the release that renamed `code remove`/`ls`). Nothing shipped under
  T12's `add`/`remove`/`ls`, so there is no migration to describe — but the
  `code` floor is a real one and belongs in the notes.
- Check `install.sh` and the release workflow still match the repo rename to
  `codelovesme/euglena` (commit 12d612d) — the README's `install.sh` URL
  already points at `codelovesme/euglena/main`.
- CI: the gated real-run tests should stop being gated. Have the workflow
  download the pinned `code` release tarball
  (`gh release download v1.1.3 --repo codelovesme/code`) and set
  `EUGLENA_TEST_CODE_BIN`, so "does a scaffolded app actually run?" is
  answered on every push instead of only on a developer's machine. That
  question going unanswered in CI is the root cause of T2, T3 and this
  entire ticket set.
- Coordinate with `cdlvsm`: `cdlvsm install code` must deliver v1.1.3. The
  shim on a current machine is still a v0.4-era binary.
