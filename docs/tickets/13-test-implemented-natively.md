# 13 — `test` is implemented here, not shelled out

- **Priority:** High
- **Type:** Bug
- **Area:** `src/exec.rs`, `src/main.rs`

## Context

`euglena test` runs `code test`. **There is no `code test` subcommand.**
v1.1.3's commands are `init`, `run`, `build`, `install`, `remove`, `ls`,
`format`. The command has been dead since the language dropped it.

How `code` itself tests: every `tests/*.code` fixture asserts its own
expected values and is simply *run* — a plain `foo.code` must succeed, a
`fail_foo.code` must fail. The fixtures are the specification. euglena can
adopt the same convention rather than invent one.

## Change

`euglena test` walks `<project>/tests/*.code` in sorted order and runs each
through `code run`:

- a plain `foo.code` must exit 0;
- a `fail_foo.code` must exit non-zero;
- print one line per fixture, then a summary; exit non-zero if any failed.

Fixtures run **in place**, so `tests/` is their base directory: the `.code/`
walk-up finds the project and installed organelles resolve, while a fixture
that wants a gene links it explicitly (`link "../src/nucleus.gene.code"`).
That is more typing than an implicit environment, and it is what makes a
fixture readable on its own — the same trade `code`'s own suite makes.

`euglena init` should scaffold one starter fixture so `test` has something to
say on day one.

## Verify

- Unit with a fake `code` shim: a passing fixture, a failing one, a
  `fail_*.code` that must fail, and the exit code of the whole run.
