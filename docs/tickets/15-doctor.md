# 15 — `euglena doctor`

- **Priority:** Low
- **Type:** Feature
- **Area:** new `src/doctor.rs`

## Context

The failures this migration is fixing were all invisible until something
downstream broke: a stale `cdlvsm-code` that fails `--version`, a declared
organelle with no lock entry, a project with no `.code/` marker, a hand-written
`main.code` blocking generation. Each has a one-line answer that only the tool
can give.

## Change

`euglena doctor` prints, and exits non-zero if anything is wrong:

- which `code` binary was chosen, how (configured path vs `cdlvsm-code` on
  PATH), and its version against the T6 minimum;
- the project root and whether `.code/lock.json` is there;
- every declared organelle: alias, module, installed version or **missing**;
- whether `main.code` exists and is ours (GENERATED header) or the user's;
- `manifest.json` parse status, and which `${VAR}` references are unset.

Every failing line names the command that fixes it.
