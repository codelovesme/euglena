# 19 — The comment marker is `|`, and the baseline is code 2.0.0

- **Priority:** High
- **Type:** Breaking / follow the language
- **Area:** `src/codegen.rs`, `src/init.rs`, `src/exec.rs`, README, site examples
- **Upstream:** `code` 2.0.0 (`--` → `|`)

## Context

`code` 2.0.0 replaces the `--` line comment with `|`. One character, because
`--` only ever had two to keep it apart from the `-` operator, and `|` has
nothing to be kept apart from — it is not an operator in the language.

This is not a change euglena could sit out. Every `main.code` euglena
generates opens with two comment lines:

```
| GENERATED — do not edit. Modify manifest.json or src/*.gene.code instead.
| euglena 0.2.0 · body sha256:1f0c…
```

Under `code` 2.0.0 the old spelling of those lines does not parse — `--`
lexes as two `Minus` tokens and the header text as loose identifiers. So the
generated entry is invalid on the new toolchain, and the new entry is invalid
on the old one. There is no version of euglena that works with both.

## Change

- `GENERATED_HEADER` and `STAMP_PREFIX` in `codegen.rs` now begin with `|`.
  These are matched by literal prefix, not by the `code` lexer, so `doctor`'s
  three states (up to date / stale / edited by hand) keep working unchanged —
  but the literals and every test asserting on them had to move together.
- The `init` scaffolds (`nucleus.gene.code`, the starter fixture) use `|`.
- `site/examples/*.gene.code` use `|`.

## Baseline, and the floors it swallowed

`MIN_CODE_VERSION` goes **1.1.0 → 2.0.0**. It is the version euglena's
*generated syntax* needs, and that syntax now needs the new comment marker.

That bump made both per-command floors unreachable and they are **removed**:

| floor | was | why it is gone |
|---|---|---|
| `MIN_CODE_VERSION_FOR_TEST` | 1.2.0 (`code test`) | below 2.0.0 |
| `MIN_CODE_VERSION_FOR_UNINSTALL` | 1.3.0 (`code uninstall`, T18) | below 2.0.0 |

No `code` can satisfy a 2.0.0 baseline and still be too old for either
command, so neither floor could ever raise the bar. A floor that cannot fire
is a claim nothing checks, and `tests/delegation.rs` had a case asserting one
*did* fire, which is no longer a reachable state. Both constants, the
`uninstall_code_binary_or_exit` helper, and that test are gone;
`euglena uninstall` uses `baseline_code_binary_or_exit` like the rest.

The **mechanism** stays: `version_need` still takes a `command_floor`, for
the next subcommand that lands ahead of whatever the baseline is then.

## Not done here

The 26 unmigrated apps in `my-euglena-apps` still use `->`, the marker from
the pre-rewrite language. They did not parse before this change either — see
the note on `ping-web`. `ping-api`, the one migrated app, moved to `|` and
its manifest now asks for `>=2.0.0`.
