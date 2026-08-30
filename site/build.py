#!/usr/bin/env python3
"""Assembles dist/index.html for the euglena marketing site.

Reads the hand-written snippets in site/examples/ (current Code syntax —
see src/init.rs for the canonical nucleus template and src/codegen.rs for
the canonical Sap lines), turns each into a gallery entry, and injects the
JSON array into the __EXAMPLES__ placeholder in site/index.html.

Unlike the code-language site there is no test-fixture corpus to mine: the
snippets ARE the content, curated to show one concept each. Descriptions
come from each file's first `--` comment line (the Code language's comment
marker), truncated to keep cards tidy.

Usage: build.py <repo-root> <dist-dir>
"""
import json
import shutil
import sys
from pathlib import Path

# Ordered: first matching prefix wins.
CATEGORY_BY_PREFIX = [
    ("nucleus_", "Nucleus"),
    ("particle_", "Particles"),
    ("emission_", "Particles"),
    ("organelle_", "Organelles"),
    ("sap_", "SAP Config"),
    ("loop_", "Loops"),
]
DEFAULT_CATEGORY = "Concepts"


def category_for(name: str) -> str:
    for prefix, cat in CATEGORY_BY_PREFIX:
        if name.startswith(prefix):
            return cat
    return DEFAULT_CATEGORY


def first_comment(source: str) -> str:
    """The file's first `--` comment line, stripped — the author's own
    one-line explanation of the concept."""
    for line in source.splitlines():
        s = line.strip()
        if s.startswith("--"):
            text = s[2:].strip()
            if text:
                return text
    return ""


def truncate(text: str, limit: int = 110) -> str:
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0]
    return cut.rstrip(",;: ") + "…"


def main() -> None:
    repo_root = Path(sys.argv[1])
    dist_dir = Path(sys.argv[2])
    examples_dir = repo_root / "site" / "examples"
    site_dir = repo_root / "site"

    examples = []
    # .gene.code first (the common case), then other fixtures like manifests.
    paths = sorted(examples_dir.glob("*.gene.code")) + sorted(
        p for p in examples_dir.iterdir() if p.suffix == ".json"
    )
    for path in paths:
        name = path.name
        if name.endswith(".gene.code"):
            stem, ext = name[: -len(".gene.code")], ".code"
        elif name.endswith(".json"):
            stem, ext = name[: -len(".json")], ".json"
        else:
            continue
        source = path.read_text()
        examples.append(
            {
                "name": stem,
                "display": stem + ext,
                "category": category_for(stem),
                "description": truncate(first_comment(source)),
                "code": source,
            }
        )

    # Escaping "</" guards against a snippet ever containing a "</script>"
    # substring, which would otherwise close the embedding <script> tag early
    # and corrupt the page.
    examples_json = json.dumps(examples).replace("</", "<\\/")

    template = (site_dir / "index.html").read_text()
    if "__EXAMPLES__" not in template:
        sys.exit("error: __EXAMPLES__ placeholder missing from site/index.html")
    page = template.replace("__EXAMPLES__", examples_json)

    dist_dir.mkdir(parents=True, exist_ok=True)
    (dist_dir / "index.html").write_text(page)

    # Static assets (logo, favicon) live next to index.html in site/ and are
    # copied through verbatim — the page references them by relative path.
    for asset in sorted(site_dir.glob("*.png")):
        shutil.copy2(asset, dist_dir / asset.name)

    print(f"wrote {dist_dir / 'index.html'} ({len(examples)} examples)")


if __name__ == "__main__":
    main()
