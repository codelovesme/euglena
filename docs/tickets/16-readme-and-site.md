# 16 — README and site refresh

- **Priority:** Medium
- **Type:** Docs
- **Area:** `README.md`, `site/index.html`, `site/examples/*`, `site/build.py`

## Context

The README documents a model that no longer exists: a "Finding `code`"
section built around `cdlvsm-code` discovery is still right, but the app
layout section describes organelles "resolved from `euglena-organelles/`
directories in the project's ancestor folders", and the command list carries
a `test` that shells out to a subcommand `code` does not have.

The five snippets in `site/examples/` are worse — they are the *marketing
site's* code samples and every one of them is invalid:

- all use `->` comments (and `build.py` reads the first `->` line as each
  card's description);
- `nucleus_boot`, `particle_handlers`, `organelle_call` declare particle
  schemas with `Particle ∩ { … }`;
- `nucleus_boot` assigns `booted = false` with no `let`;
- `emit server.Respond { … }` and `emit logger.Log { … }` use dotted class
  names, which no longer parse as particles;
- `sap_manifest.json` shows organelles as `.so`/`.wasm` **paths**.

`loop_over.gene.code` is the one that survives: `loop n over nums { }`,
`doubled = doubled + [n * 2]` and string `+` all still work — verified.

## Change

- README: replace the organelle-discovery section with `.code/` + `add`/`ls`;
  update the command table (T12, T13, T14); state the v1.1.3 minimum (T6);
  document that `main.code` is generated and gitignored (T9).
- Rewrite all five site snippets in current syntax, and switch `build.py`'s
  description scraper from `->` to `--`.
- Add a snippet showing what v1.1 makes newly idiomatic: an `http_server`
  cell — a pushed `Request` answered by `return Response { … }`, held up by
  `loop { }`. That is the euglena cell model expressed natively, and it is a
  better first impression than the old `request_id` + `Respond` dance.
- Every snippet should be a file that actually runs; wire a CI step that
  runs `code format --check site/examples/` so they cannot silently rot.
