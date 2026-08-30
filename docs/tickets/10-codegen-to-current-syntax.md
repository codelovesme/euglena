# 10 — Codegen to current syntax

- **Priority:** Critical
- **Type:** Bug / compatibility
- **Area:** `src/codegen.rs`

## Context

Every kind of line `generate_main_code` emits is now wrong.

| Emitted today | v1.1.3 |
|---|---|
| `link organelles/x.so as x` | `link "…" as x` — the reference is a **quoted string** |
| `link state_loader.gene.code` | `link "src/state_loader.gene.code"` — quoted, and project-root-relative now that the entry sits at the root (T9) |
| `emit fs.Sap { … } to fs` | `emit Sap { … } to fs` — a particle class is an uppercase name followed by `{`; `fs.Sap` parses as member access, not a class |
| `-> GENERATED …` | `-- GENERATED …` |
| `Null` (for a JSON null) | `null` |

`emit … to this` for the boot particle is unchanged and still correct —
verified against v1.1.3.

Dropping the `<alias>.` prefix from `Sap` is safe: dispatch is per-recipient,
so every organelle receiving its own `Sap` is unambiguous. It does mean `Sap`
becomes shared vocabulary across organelles, which is the same convention
`code` documents for `Log` and `Exception`.

## Change

- Quote every `link` reference.
- Genes: `link "src/<name>.gene.code"`. (The `.code` extension is optional to
  the loader but write it — the file is a real path here, not a bare name.)
- Sap: `emit Sap { … } to <alias> get _sap_<alias>`, still one line per
  organelle that declares a `sap` block, still capturing the reply so a gene
  can see an `Exception` come back.
- `format_sap_value`: JSON null → `null`. Booleans and numbers are already
  spelled the same. Strings keep their escaping.
- Header in `--`.
- Leave `${VAR}` interpolation, `.env` loading and the `EUGLENA_MOCK_MODE` /
  `EUGLENA_MOCK_TYPES` overlay in [`manifest.rs`](../../src/manifest.rs)
  untouched. None of it touches language syntax, and `code` has no
  equivalent — this is the part of euglena that is still load-bearing.

## Verify

- The existing `codegen::tests` assertions all pin old syntax; rewrite each
  to the new spelling.
- Add a test that the generated text parses: gated on `EUGLENA_TEST_CODE_BIN`,
  scaffold → generate → `code run`.
