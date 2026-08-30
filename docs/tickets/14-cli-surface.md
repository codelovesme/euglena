# 14 — CLI surface: build flags and `format`

- **Priority:** Medium
- **Type:** Feature / compatibility
- **Area:** `src/main.rs`, `src/exec.rs`

## Context

Two mismatches with v1.1.3's CLI, and one capability that is simply not
exposed.

**Default entry.** euglena defaults `run`/`build` to `src/main.code` and maps
a directory argument to `<dir>/src/main.code`. v1.1.3's convention is a
directory meaning its **`main.code`**, and after T9 the generated entry lives
at the project root — so the default should be the project directory itself
and `resolve_entry_file` goes away.

**Build targets.** euglena hardcodes `--target exe`. v1.1.3 offers
`exe | shared | static | wasm`, and `--target shared` is how a `.code` file
becomes a linkable module (handlers → `code_module_dispatch`, `export let` →
`code_module_vars`). That is the supported path for a cell to *be* an
organelle for another cell, which is worth having rather than hiding.

**`code format` exists and is not exposed.** It formats the token stream, so
comments and literal spellings survive, and the same formatter runs in the
LSP.

## Change

```
cdlvsm euglena build [path] [--release] [--target exe|shared|static|wasm] [-o <path>]
cdlvsm euglena format [--check] [path...]     default: src/ tests/
```

- `build` passes `--target` through, defaulting to `exe`; `--release` and
  `-o` map to the same flags.
- Document that without `-o` the artifact lands in `<project>/build/<project>`
  — `code`'s rule is "a `build/` beside what you named", and after T9 what we
  name is the project directory.
- `format` shells out to `code format`, defaulting to `src/` and `tests/`.
  `--check` writes nothing and exits non-zero, which is the CI shape.
