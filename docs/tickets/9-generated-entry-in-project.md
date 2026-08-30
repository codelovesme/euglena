# 9 — The generated entry moves into the project

- **Priority:** Critical
- **Type:** Bug / architecture
- **Area:** `src/codegen.rs` (`generate_main_code_file`), `src/exec.rs`

## Context

euglena generates the app entry into a PID-scoped **temp directory**
(`/tmp/euglena_<pid>/main.code`) and hands that path to `code`. Under v1.1.3
that is no longer viable, for three separate reasons.

**1. Module resolution is anchored to the entry file's directory.** The chain
is: the script's own directory → the nearest ancestor's `.code/modules/` →
`$CODE_MODULE_PATH` → `~/.code/modules/`. From `/tmp` there is no project,
so nothing installed resolves. Measured against the real binary:

```
CODE_MODULE_PATH=<project> code run /tmp/…/main.code
error: cannot resolve module 'terminal-linux-x86_64.so' from '/tmp/…/main.code'
       (looked in: '/tmp/…', '<project>', '/home/…/.code/modules')
```

**2. The lockfile's sha256 check is silently skipped.** `verify_locked_module`
only enforces when it can find the project's `.code/` from the entry's
directory. A temp entry therefore *loses the integrity guarantee* rather than
failing loudly — the worst of the three failures, because it looks like it
worked.

**3. Build output lands in the wrong place.** v1.1.3 always writes artifacts
to a `build/` directory beside what you named. A temp entry means the binary
appears at `/tmp/euglena_<pid>/build/main` and is deleted with the temp dir.

## Change

Write the generated entry to **`<project>/main.code`**, with the existing
`-- GENERATED` header (in `--`, per T7).

- Regenerate on every `run` / `build` / `test`.
- Refuse to overwrite a `main.code` that does **not** carry the GENERATED
  header — that is a file the user wrote, and clobbering it is not a thing a
  scaffolding tool gets to do. Error, name the file, exit non-zero.
- Delete the temp-dir creation and `cleanup_generated_entry` entirely.
- Leave the generated file in place after a run. It is gitignored (T8), and
  a readable artifact that plain `code run .` also executes is worth more
  than a hidden one — it makes "what did euglena actually generate?"
  answerable without a debugger.
- `run`/`build` then invoke `code <cmd> <project-dir>`, letting `code`'s own
  directory-means-`main.code` convention do the rest.

## Verify

- Unit: an existing hand-written `main.code` is refused; a GENERATED one is
  overwritten.
- Gated real-run: an app declaring an installed organelle runs, and
  `euglena build` puts its binary at `<project>/build/<project>`.
