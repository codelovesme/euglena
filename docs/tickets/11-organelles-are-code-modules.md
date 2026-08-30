# 11 — Organelles resolve through code's module system

- **Priority:** Critical
- **Type:** Architecture
- **Area:** `src/exec.rs` (`discover_euglena_organelles_paths`, `merge_code_path_env`), `src/manifest.rs`

## Context

euglena carries its own module story: organelles are **paths** in
`manifest.json`, found by walking ancestors for a `euglena-organelles/`
directory and exported through `CODE_PATH`. Against v1.1.3 all three pieces
are wrong.

- **`CODE_PATH` does not exist.** The variable is `CODE_MODULE_PATH`, and it
  is only the *third* of four search roots.
- **`code` has its own installer.** `code install <name>` fetches a module
  into `./.code/modules/<name>/<version>/`, pins it by sha256 in
  `./.code/lock.json`, and verifies that hash at link time. euglena's
  ancestor-walk is a second, unpinned, unverified mechanism for the same job.
- **`.wasm` organelles are refused outright**: "only .so, .a and .code are"
  supported. Any manifest naming a `.wasm` organelle is dead.

There is also a naming detail that matters for codegen: an installed module's
asset is platform-suffixed. `code install terminal` prints

```
link it with:  link "terminal-linux-x86_64.so" as <alias>
```

so the linkable name is `terminal-linux-x86_64.so`, not `terminal.so`.
Hardcoding either spelling in a manifest is wrong; the lockfile is the only
source of truth.

## Change

An organelle entry's value becomes a **module name**, not a path:

```json
{
  "name": "myapp",
  "organelles": {
    "term": "terminal",
    "srv": { "module": "http_server", "sap": { "port": "${PORT}" } }
  }
}
```

- Read `<project>/.code/lock.json`, map each declared module name to its
  `asset`, and emit `link "<asset>" as <alias>`.
- A declared organelle with no lock entry is an error naming the fix:
  `cdlvsm euglena add <name>`. Failing at generation time with that sentence
  beats a loader error listing four directories.
- Keep an escape hatch: a value containing `/` or ending in `.so`/`.code` is
  treated as a literal path relative to the project root, for a vendored or
  locally-built organelle. Reject `.wasm` with the reason.
- Delete `discover_euglena_organelles_paths` and `merge_code_path_env`, and
  stop setting any `CODE_PATH`. With the entry at the project root (T9),
  genes and installed modules both resolve natively and euglena sets no
  environment at all.
- `mock-organelles` overlays by the same rules; the derived "type" for
  `EUGLENA_MOCK_TYPES` now comes from the module name rather than a path
  basename, which is simpler than the current `_mock`-suffix stripping.

## Verify

- Unit: lock entry → link line; missing entry → the `add` error; `.wasm` →
  refused; a `/`-bearing value stays a literal path.
- Gated: an app declaring `terminal` runs and prints, with nothing on
  `CODE_MODULE_PATH`.

## Note

The ~25 organelles in `euglena-language/euglena-organelles/` (jwt, mongodb,
mailer, crypto, dom, fs, git, blob-storage…) are written against the old ABI
and none of them install this way yet. Porting them to the current
`code-native` crate is deliberately **out of scope** for this round (owner's
call, 2026-08-30); this round targets the first-party modules `code` already
ships — terminal, math, strings, env, http_client, http_server.
