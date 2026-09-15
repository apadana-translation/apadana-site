# Pandoc port: Jekyll → Eleventy

Port `jekyll-pandoc-multiple-formats` to work with the Eleventy build. Pandoc remains a hard requirement. GitHub Actions integration is nice-to-have.

Reference: the old plugin source at `~/src/jekyll-pandoc-multiple-formats`. Authoritative pandoc flag set lives in `_config.yml` (the Jekyll config, retained in the repo root as a reference).

## 1. Scope

Three output tiers, each as both EPUB and PDF:

- **Per-poem** — one per file in `src/_poems/**/*.md` (~600 files × 2 formats)
- **Per-chapter** — four bundles × 2 formats
- **Full set** — one bundle × 2 formats

Drop the features the current `_config.yml` already disables: `imposition: false`, `binder: false`, no `signature`. Keep cover handling — `_assets/covers/` already has matching PNG/PDF/SVG files for each chapter and the full set.

No bibliography handling needed (confirmed 2026-04-17 — not used in this book).

## 2. Output paths (matches existing live URLs)

- **Per-poem**: `dist/text/<chapter-slug>/<poem-slug>.<ext>` — flat, no `index.` prefix. The live site serves `/text/chapter-4/poem-001.pdf` and `.epub` at this pattern. The current Eleventy HTML permalink is `/text/<chapter-slug>/<poem-slug>/index.html` (pretty), so the PDF/EPUB sit alongside but without the pretty folder.
- **Per-chapter & full**: `dist/public/links/walters_<slug>.<ext>` — from the old `bundle_permalink` in `_config.yml`.

## 3. Architecture

**Standalone Node script**, not an Eleventy plugin. Invoked as `yarn build:pandoc` after `yarn build`.

Why not an Eleventy plugin:
- pandoc is an external binary; nothing about it benefits from being inside Eleventy's render loop.
- Pandoc runs are slow (seconds per file × ~1200 artifacts). They must not fire on every dev save.
- A standalone script can be skipped locally and run only on release or in CI without changing `yarn dev` / `yarn build`.
- Parallelizing pandoc jobs with `p-limit` is simpler than fighting Eleventy's lifecycle.

Trade-off: the script re-parses frontmatter and re-derives chapter ordering rather than reusing `.eleventy.js` collections. Small duplication — sort key is just `order`. The alternative (exporting a JSON manifest from Eleventy and consuming it in a second process) adds fragile coupling for little payoff.

## 4. Module layout

```
config/pandoc/
├── build.mjs           # entry — orchestrates the queue
├── manifest.mjs        # walks src/_poems, returns {poems, chapters, full}
├── job.mjs             # one pandoc invocation: builds args, spawns process
├── covers.mjs          # PNG → PDF conversion + cache
├── bundle.mjs          # concatenates poems for chapter / full bundles
│                       #   (NO bibliography stripping — not needed here)
└── settings.mjs        # config block — port of _config.yml's pandoc: section
```

`build.mjs` flow:
1. Build the manifest (per-poem, per-chapter, full-set jobs).
2. Ensure cover PDFs exist for any cover that is still PNG-only (cached in `_assets/covers/`, regenerated only if the PNG is newer).
3. Run the job queue with a concurrency limit (`p-limit`, default `os.cpus().length`).
4. For PDF jobs that have a cover, run `pdfunite` (or `qpdf`) to prepend — same trick as `generator.rb:96–105`.

Each job writes one artifact and is idempotent: skip if the output is newer than every input (source `.md`, layout `.tex` / `.xml`, cover, and `settings.mjs` via mtime).

## 5. Pandoc invocation

Reuse flags already in `_config.yml`:

- **EPUB**: `--epub-chapter-level=1 --epub-metadata=src/_includes/layouts/epub-metadata.xml --epub-cover-image=<cover.png>`
- **PDF**: `--pdf-engine=xelatex` plus all the `-V` geometry flags and `--include-in-header=src/_includes/layouts/pdf-header.tex --include-before-body=src/_includes/layouts/pdf-frontmatter.tex`

The layout files (`epub-metadata.xml`, `pdf-header.tex`, `pdf-frontmatter.tex`, `output-template.tex`) already exist under `src/_includes/layouts/`. They're inert during Eleventy's run (no template extends them), so they pass through as pandoc input.

Input is fed on stdin: a synthesized YAML frontmatter block (title, author, papersize), then the concatenated markdown body. Matches `pandoc_file.rb:149–168`. No temp files.

Markdown extensions used by the site (`bracketed-spans`, `attrs`, `footnote`) all map to pandoc-flavored markdown natively. Pandoc is the most permissive common markdown engine for these constructs, so output should be visually consistent with the HTML site.

## 6. Bundle assembly

Concatenate poem markdown bodies with `\n\n` separators. No bibliography handling. Chapter title/slug come from the chapter label in `_config.yml` (`The Legend of the Buddhas`, etc.). Full bundle title from `site.title` / `site.subtitle`. Slugs already match cover filenames (`the-legend-of-the-buddhas.png`, `legends-of-the-buddhist-saints.png`).

## 7. Build integration

Add to `package.json`:

```json
"build:pandoc": "node config/pandoc/build.mjs",
"build:all":    "yarn build && yarn build:pandoc"
```

Leave `yarn build` and `yarn dev` alone. `build:pandoc` runs against `dist/` after Eleventy — depends on `yarn build` having run but does not re-trigger it.

## 8. CI / GitHub Actions (nice-to-have)

Two-job workflow on push / release:

1. **Build site** (existing): Node 24, `yarn install`, `yarn build`, upload `dist/`.
2. **Build pandoc artifacts** (new): `ubuntu-latest`, install pandoc + TeX Live subset (`texlive-xetex`, `texlive-fonts-recommended`, `texlive-latex-extra`) + `poppler-utils` for `pdfunite` + `imagemagick` for PNG→PDF. Download site artifact, run `yarn build:pandoc`, re-upload merged artifact for deploy.

TeX install is ~3–5 min first run, cacheable via `actions/cache`. Alternative: `pandoc/latex` Docker image (ships pandoc + xelatex preinstalled).

Phase-appropriate: phase 1 is "run locally, commit artifacts to a release, point S3 at them"; phase 2 wires into Actions. Script is identical either way.

## 9. Phasing

1. **Manifest + single-poem EPUB + PDF.** One poem rendering end-to-end with covers. Diff against live `poem-001.pdf` / `.epub`.
2. **Chapter bundles.**
3. **Full-set bundle.**
4. **Idempotent skip + parallelism.**
5. **Wire artifact links into poem/chapter/site UI.**
6. **(Optional) GitHub Actions.**

## 10. Validation

Fetch the live artifacts from `apadanatranslation.com` and diff against freshly generated ones:
- EPUB: `unzip -l` both, diff the file lists; pandoc-convert both to plain text, diff that.
- PDF: `pdftotext` both, diff the text. Raw bytes will differ (pandoc/TeX timestamps). Visual sanity check the first and last pages.

## 11. Toolchain dependencies (local)

- `pandoc` (3.5 installed ✓)
- `pdfunite` from poppler (✓)
- `convert` / `magick` from ImageMagick (✓)
- `xelatex` — **not installed**; requires `brew install --cask basictex` (small) or `mactex` (full). Only needed for PDF generation; EPUB path doesn't depend on it.
