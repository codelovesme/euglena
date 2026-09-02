# 18 — One module vocabulary: `install` / `uninstall` / `list`

- **Priority:** Medium
- **Type:** Feature / breaking rename
- **Area:** `src/main.rs`, `src/modules.rs`, `src/exec.rs`, README
- **Supersedes the naming in:** [T12](12-add-remove-ls.md)

## Context

Three tools in one family spelled the same three operations three ways:

| | add | drop | list |
|---|---|---|---|
| `cdlvsm` | `install` | `uninstall` | `list` |
| `code` (≤1.2.1) | `install` | `remove` (`rm`) | `ls` |
| `euglena` (T12) | `add` | `remove` | `ls` |

The inconsistency is the smaller half. The larger one: `remove` and `ls` were
spelled *identically* in `code` and `euglena` while meaning different things —
`code remove <module>` against `euglena remove <alias>`, `code ls` (installed
modules) against `euglena ls` (declared organelles). Same word, different
contract, which is what T14's own reasoning rejects for `run`.

## Change

`cdlvsm`'s set wins in all three. `cdlvsm` needed no change.

```
cdlvsm euglena install <name> [--as <alias>]   was `add`
cdlvsm euglena uninstall <alias>               was `remove`
cdlvsm euglena list                            was `ls`
```

`code` 1.3.0 renamed `remove`/`rm` → `uninstall` and `ls` → `list`, as a hard
rename: the old spellings are `unknown command`, with no compatibility alias.
A second working spelling is the thing this rename exists to remove.

The argument asymmetry stays, and is documented rather than papered over:
`code uninstall` takes a **module name**, `euglena uninstall` takes the
**alias**, because the manifest is keyed by alias and that is what
`euglena list` prints.

## Version floor

`euglena uninstall` shells out to `code uninstall`, which exists only from
**code 1.3.0**. `exec::MIN_CODE_VERSION_FOR_UNINSTALL` carries that, and
`exec::uninstall_code_binary_or_exit` passes it as a command floor through the
existing `VersionNeed` machinery — so the refusal names `code uninstall` as
what raised the bar, rather than euglena's baseline or the app's manifest.

The floor is on `uninstall` **only**. `euglena install` calls `code install`,
whose spelling did not change, and `euglena list` reads the lockfile without
invoking `code` at all; neither should refuse a `code` that would serve it.

## Also fixed here

`manifest_still_references_module` read only the `organelles` block, so
`uninstall` deleted the bytes of a module referenced solely from
`mock-organelles` and the next `EUGLENA_MOCK_MODE=true` run failed at link
time. It now scans both blocks.
