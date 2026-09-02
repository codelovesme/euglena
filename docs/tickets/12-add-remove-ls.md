# 12 — `add` / `remove` / `ls` over `code install`

> **Renamed by [T18](18-one-module-vocabulary.md)** — the three commands are
> now `install` / `uninstall` / `list`, matching `cdlvsm` and `code`. The
> behaviour below is unchanged; only the spellings are. These never shipped.

- **Priority:** Medium
- **Type:** Feature
- **Area:** `src/main.rs`, new `src/modules.rs`

## Context

Once organelles are code modules (T11), installing one takes two steps that
must agree: fetch the bytes, and declare the alias in `manifest.json`. Doing
that by hand is exactly the kind of two-place edit that drifts — a lock entry
with no manifest alias links nothing, a manifest alias with no lock entry is
T11's error.

## Change

```
cdlvsm euglena add <name> [--as <alias>]   code install <name>, then record it
cdlvsm euglena remove <alias>              drop the manifest entry, then code remove
cdlvsm euglena ls                          declared organelles, and whether each is installed
```

- `add` shells out to `code install <name>` with the project root as cwd, so
  bytes land in this project's `.code/modules/` and the lockfile it pins is
  this project's. Then insert `"<alias>": "<name>"` into `manifest.json`,
  defaulting the alias to the module name.
- Preserve the manifest's formatting as far as `serde_json` allows, and never
  touch a `sap` block that is already there.
- `ls` is the one command that reads both sides and reports a mismatch,
  which makes it the cheap answer to "why won't this link?".

Deliberately **not** wrapped: `code install --global`. A cell's organelles
belong to the cell.
