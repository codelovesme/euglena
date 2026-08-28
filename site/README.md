# euglena site

Static marketing landing page for the euglena framework. Self-contained HTML/CSS/JS
— no frameworks, no build dependencies beyond Python 3 stdlib.

## Layout

```
site/
├── index.html     # template (single self-contained page)
├── examples/      # hand-written Code snippets embedded into the gallery
│   ├── *.gene.code
│   └── sap_manifest.json
├── build.py       # assembles dist/ from template + examples
├── logo.png / favicon-32.png
└── dist/          # generated output (committed? no — built in CI)
```

## Build & preview

```sh
python3 site/build.py . site/dist
xdg-open site/dist/index.html   # or open in any browser
```

`build.py` reads every file in `examples/`, derives each entry's category from its
filename prefix (`nucleus_`, `particle_`, `emission_`, `organelle_`, `sap_`, `loop_`)
and description from its first `->` comment line, then injects the JSON array into
the `__EXAMPLES__` placeholder in `index.html`.

## Conventions

- Example files must start with a `->` comment — that line becomes the card blurb.
- Keep snippets valid against current Code syntax (see `euglena-language/code-language`).
- New categories: extend `CATEGORY_BY_PREFIX` in `build.py` **and** `CAT_COLORS` in
  `index.html` (script section), plus a chip if you want it filterable.

## CI

`.github/workflows/site.yml` rebuilds `dist/` on changes under `site/**`, fails if the
placeholder survives, and uploads the result as the `euglena-site` artifact.
