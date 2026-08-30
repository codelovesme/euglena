# Tickets

One file per task. Finished ones move to `done/`.

## Open: the v1.1.3 migration

`code` moved from v0.4.x to **v1.1.3** and took half of euglena's job with it:
it now has a project marker (`.code/`), an installer with a sha256 lockfile,
first-party modules, `format`, and an event-loop story (`http_server` pushes
`Request`, a handler answers, `loop { }` keeps the program up). euglena stops
being a second loader and a second package manager, and stays the **cell
layer** on top: manifest, genes, boot particle, Sap config, mock mode.

Decided (2026-08-30, owner): thin framework — keep codegen but write the
entry *into the project*; organelles resolve through `code install` +
`.code/lock.json`; Sap stays in the manifest and becomes `emit Sap { … } to
<alias>`; porting the ~25 organelles in `euglena-language` is out of scope
for this round.

| # | Ticket | Depends on |
|---|---|---|
| 6 | [Target code v1.1.3, and refuse older](6-target-code-v1-1-3.md) | — |
| 7 | [Templates to current syntax](7-templates-to-current-syntax.md) | 6 |
| 8 | [`init` scaffolds a real code project](8-init-scaffolds-a-code-project.md) | 7 |
| 9 | [The generated entry moves into the project](9-generated-entry-in-project.md) | 8 |
| 10 | [Codegen to current syntax](10-codegen-to-current-syntax.md) | 9 |
| 11 | [Organelles resolve through code's modules](11-organelles-are-code-modules.md) | 10 |
| 12 | [`add` / `remove` / `ls` over `code install`](12-add-remove-ls.md) | 11 |
| 13 | [`test` implemented here, not shelled out](13-test-implemented-natively.md) | 9 |
| 14 | [CLI surface: build flags and `format`](14-cli-surface.md) | 9 |
| 15 | [`doctor`](15-doctor.md) | 11 |
| 16 | [README and site refresh](16-readme-and-site.md) | 11, 14 |
| 17 | [Release 0.2.0](17-release-0-2-0.md) | all |

Ship order is the table order. 13 and 14 are independent of the 11/12 pair
and can go in parallel.
