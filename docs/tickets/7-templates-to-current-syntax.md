# 7 — Templates to current syntax

- **Priority:** High
- **Type:** Bug / compatibility
- **Area:** `src/init.rs` (`nucleus_gene_template`), `tests/scaffold.rs`

## Context

Every line of the scaffolded nucleus gene is now a syntax error. This is the
third time this template has been chased forward (see T2, T3 in `done/`) —
the difference is that the constructs it uses no longer exist at all, rather
than having been spelled differently:

| Template today | v1.1.3 |
|---|---|
| `->` comment | `--` |
| `EuglenaHasBeenBorn = Particle ∩ { _class ∈ "…", cell_name ∈ String }` | Gone. `Particle` and `∩` belong to the archived language in `code/old/` |
| `EuglenaHasBeenBorn => {` | The field list is required: `EuglenaHasBeenBorn { cell_name } => {` |
| `booted = false` | `let` is mandatory for a first binding; a bare assignment to an undeclared name is an error |

A particle is now *parser sugar* for an object with a `_class` field. There
is nothing to declare: `Foo { a = 1 }` is `{ _class = "Foo", a = 1 }`. Kinds
may still be annotated with `∈` in a field list or a `let`, but nothing
checks them — they read like a comment and can be wrong like one.

## Change

Rewrite `nucleus_gene_template` against v1.1.3. Roughly:

```
-- Nucleus gene — the cell's boot handler.
--
-- Any src/*.gene.code file is linked into the app automatically. Handlers
-- defined here join one program-wide dispatch table, so a gene is just a
-- file that answers particles.

export let gene_name = "nucleus"

EuglenaHasBeenBorn { cell_name } => {
    return Alive { cell_name = cell_name }
}
```

Verified to run under v1.1.3 (`emit … to this` round-trips and `Alive`
carries `cell_name` back). Keep it module-free so a fresh scaffold runs with
nothing installed — the same reason `code init`'s own template avoids
printing.

## Verify

- `tests/scaffold.rs`: the assertions currently pin the **removed** syntax
  (`Particle ∩ { … }`, `_class ∈ "EuglenaHasBeenBorn"`). Replace them: the
  gene must use `--` comments, a handler with a field list, `let` for every
  first binding, and must *not* contain `Particle`, `∩`, or `->`.
- The gated `scaffolded_app_runs_against_real_code` test must pass against a
  v1.1.3 binary.
