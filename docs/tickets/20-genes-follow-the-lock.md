# 20 — Genes follow the lock; a build fetches what it pins

- **Priority:** High
- **Type:** Bug / package manager
- **Area:** `src/genes.rs`, `src/modules.rs`, `src/exec.rs`, `src/main.rs`

## What happened (2026-11-24)

Rebuilding every web app in my-euglena-apps, seven apps stopped at "the gene
'palette' is not installed": gene files are not committed (`.code/genes/` is
ignored), and that checkout had never installed them. `euglena install` was
0.9.0 while the locks pinned `palette`/`ui` 0.10.0. It fetched from its *own*
release, found no `ui` there, and wrote `palette` down to 0.9.0 in the lock.

## Now

- `euglena install` (bare) fetches each gene at the version, from the release
  and with the sha256 that `.code/lock.json` pins. Bytes republished since
  are refused, naming `euglena install <name>` to take them.
- A pin newer than this euglena is refused before anything is fetched, and
  the lock is left alone: "upgrade euglena (`cdlvsm install euglena`)".
- `euglena install <name>` refetches the pinned version, new bytes allowed
  (as before: how a same-version republish is taken).
- `euglena install --upgrade` is the one way a pin moves to this euglena's
  release.
- `run` / `build` / `test` fetch a gene that is pinned but not installed
  before generating the entry, so a fresh checkout builds on the first try.
  A declared gene with no pin still asks for `euglena install`.
- Install messages go to stderr, so a build that fetches does not put words
  in front of the program's output.

## Acceptance

- [x] `tests/genes.rs`: a build fetches a pinned gene it does not have; a
      bare install refuses republished bytes; a pin newer than euglena is
      refused and the lock kept (install and run); only `--upgrade` moves a
      pin. Existing gene tests unchanged and green.
- [x] `cargo test`, `cargo clippy --all-targets` clean.
- [x] my-euglena-apps: ping-api and ping-web build; hello-web with its gene
      files removed builds and fetches `palette`/`ui` 0.10.0 from the real
      release, lock untouched.
