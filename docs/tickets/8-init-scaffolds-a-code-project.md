# 8 — `euglena init` scaffolds a real code project

- **Priority:** High
- **Type:** Feature / compatibility
- **Area:** `src/init.rs`

## Context

`code` v1.1 marks a project root with a **`.code/` directory**. That marker
is what `link` walks up to find installed modules, and what makes
`code install` put bytes *here* rather than in whatever ancestor happens to
have a `.code/` of its own. An `euglena init` app today has no `.code/` at
all, so an `install` run inside it lands somewhere unpredictable and a
`link "console-linux-x86_64.so"` resolves against the wrong project.

## Change

`euglena init <name>` writes:

```
<name>/manifest.json            cell name, title, organelles
<name>/src/nucleus.gene.code    boot gene (T7's template)
<name>/.code/lock.json          {"modules":{}} — marks the project root
<name>/.gitignore               .code/modules/, build/, main.code
<name>/tests/                   (kept)
```

`main.code` is gitignored because T9 makes it a generated file.

Match `code init`'s refusal semantics: check every target path *before*
writing anything, so a refusal leaves the directory as it was rather than
half-initialized. An existing file is a refusal, never a merge.

Next-steps text keeps using `invocation::command_prefix()` (T5), and should
now mention `euglena install console` rather than a manual `code` install.

## Verify

- `tests/scaffold.rs`: the four files exist with the right content; a second
  `init` into the same directory fails and writes nothing.
- Gated: `init` → `run` exits 0 against a real v1.1.3 binary.
