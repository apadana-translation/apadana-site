# Plan: Migrate PDF generation from LaTeX to Typst, then run it in CI

## Goal

Replace xelatex with Typst as the Pandoc PDF engine so the PDF/EPUB build can
run unattended during deployment. The EPUB path is untouched — only the `pdf`
format in `config/pandoc/` changes. The end state: pushing content rebuilds
every download automatically; nothing is generated locally or committed.

## Why Typst solves the CI problem

The current PDF path needs four system dependencies: xelatex (TeX Live, the
old Travis config installed `texlive-full`, multiple GB), ImageMagick
(PNG → PDF covers in `covers.mjs`), poppler's `pdfunite` (prepends the cover
page in `job.mjs`), plus Pandoc itself. Typst is a single ~25 MB static
binary that replaces all three PDF-side dependencies: it renders the PDF and
can embed the cover PNG directly as a first page, so `magick` and `pdfunite`
go away entirely. CI toolchain becomes: Node + Pandoc + Typst.

Pandoc has supported `--pdf-engine=typst` since 3.1.2 (3.5 is installed
locally; pin ≥ 3.5 in CI).

## Phase 1 — Typst templates (replaces the .tex files)

Current LaTeX customizations to reproduce:

| LaTeX | Typst equivalent |
|---|---|
| `\setmainfont` Skolar PE (pdf-header.tex) | `#set text(font: "<family>", size: 12pt)` in template; fonts found via `--font-path` |
| fancyhdr alternating running heads (verso: page + book title; recto: current section + page, small caps) | `#set page(header: context {...})` using page-number parity and `query(heading.where(level: 1))` |
| `geometry`: hcentering, bindingoffset .2in, tmargin 1.2in, bmargin 1in | `#set page(paper: "us-letter", binding: left, margin: (inside: ..., top: 1.2in, bottom: 1in))` |
| `\raggedbottom` | Typst's default behavior; nothing to do |
| Copyright page with `\monthyear` (pdf-frontmatter.tex) | `pdf-frontmatter.typ` using `datetime.today().display("[month repr:long] [year]")`, via `--include-before-body` |
| `links-as-notes` | Drop it — poem sources contain no hyperlinks (verified) |
| Cover PDF merged via pdfunite | Template variable `cover-image`; template renders a full-page `#image()` with header/footer suppressed, then resets page numbering |

Work items:

1. `config/pandoc/template.typst` — start from
   `pandoc --print-default-template=typst`, add the page setup, running
   heads, and cover-image block above. Keeping it under `config/pandoc/`
   (not `src/_includes/layouts/`) is cleaner now that nothing else shares it.
2. `src/_includes/layouts/pdf-frontmatter.typ` (or move next to the template)
   — port the copyright page.
3. Confirm the font family name Typst sees:
   `typst fonts --font-path src/_assets/fonts --variants` (likely
   "Skolar PE Web" from the `SkolarPEWeb-*.ttf` files). Use that for
   `mainfont`.

## Phase 2 — Build script changes (`config/pandoc/`)

1. `settings.mjs` — replace the `pdf` format's `extraArgs`:
   `--pdf-engine=typst`, `--pdf-engine-opt=--font-path=<abs fonts dir>`,
   `--template=<template.typst>`, `-V mainfont=...`, `-V fontsize=12pt`,
   `--include-before-body=<pdf-frontmatter.typ>`. Margins/paper live in the
   template. Add `paths.pdfTemplate`; retarget `paths.pdfFrontmatter`.
2. `job.mjs` —
   - Delete `runPdfunite` and the cover-merge branch; pass the cover PNG as
     `-V cover-image=<abs path>` instead.
   - Delete the `/Library/TeX/texbin` PATH injection.
   - Update `fileDeps` for pdf jobs: template.typst, pdf-frontmatter.typ,
     fonts (unchanged), cover PNG.
   - Add the Typst version to the cache digest alongside `pandocVersion`
     (fetch `typst --version` in `build.mjs` the same way). Digest change
     forces a one-time full PDF rebuild — expected.
3. `covers.mjs` — delete `ensurePdfCover` (ImageMagick gone). `coverPngFor`
   stays.
4. Cleanup: delete `pdf-header.tex`, `pdf-frontmatter.tex`, the unused
   Jekyll-era `output-template.tex`, and the committed
   `src/_assets/covers/*.pdf` files (they only existed for pdfunite).
   Update CLAUDE.md/README (pandoc + typst required; xelatex/magick no
   longer).

Known risk: Pandoc compiles the intermediate `.typ` from a temp location, and
Typst refuses to read files outside its compilation root — the cover
`#image()` may fail to resolve. Mitigations, in order: pass
`--pdf-engine-opt=--root=/` (or the project root) so absolute paths resolve;
if that fights, fall back to keeping the pdfunite merge for covers only.
Test this first — it is the only genuinely uncertain piece.

## Phase 3 — Parity check (local, one-time)

- Build one poem, one chapter, and the full set with `--force`; compare
  against current LaTeX output: alternating headers, footnote rendering,
  Pāli diacritics (ā ī ū ṃ ṇ ṭ ḍ ḷ ñ — Skolar covers them; Typst's shaping
  is HarfBuzz-based like xelatex), verse line breaks, cover page, copyright
  page, page count in the same ballpark.
- Full `--force` run for timing. Typst is typically much faster than
  xelatex (~1.5 s startup per job currently), so the cold build should drop
  well under the current ~2.3 min.

## Phase 4 — Run it on deploy

Recommendation: **do it in the Netlify build**, not a GitHub Action.
Netlify already builds the site on every push and already needs
`FONT_CRYPT_SECRET_KEY` to unpack the web fonts, so the delta is small, and
the PDFs deploy atomically with the site into `dist/`. A GitHub Action only
makes sense if it *replaces* Netlify's build (deploying via `netlify
deploy`), otherwise the two builds race — keep that as the fallback if
build-minute limits bite.

Netlify setup:

1. `netlify.toml` — build command
   `yarn unpack-fonts && node config/ci/install-tools.mjs && yarn build:all`,
   publish `dist`.
2. `config/ci/install-tools.mjs` (new, small) — download pinned,
   checksum-verified Linux release tarballs of Pandoc and Typst into
   `.cache/bin` (skip if already cached), and have `job.mjs`/`build.mjs`
   prefer binaries from `.cache/bin` (or prepend it to PATH). ~25 MB total,
   seconds to install, exact versions pinned so the cache digest is stable.
3. `netlify-plugin-cache` with `paths = [".cache"]` — persists both the
   tool binaries and the incremental pandoc cache (outputs + state.json)
   across builds. Warm builds then skip every unchanged job (0.24 s
   locally); editing one poem rebuilds ~4 outputs.
4. Environment: `FONT_CRYPT_SECRET_KEY` (already present if Netlify builds
   the site today).
5. Verify on a deploy preview: `/public/links/walters_*.pdf|.epub` and a few
   per-poem `/text/<chapter>/<slug>.pdf` downloads.

GitHub Actions fallback (only if Netlify minutes/timeout become a problem):
on push, `actions/setup-node` + corepack, `pandoc/actions/setup` +
`typst-community/setup-typst` (both pin versions), `actions/cache` on
`.cache/pandoc` with restore-keys (the state file handles incrementality, so
a stale restore is fine), font secret, `yarn build:all`, then
`netlify deploy --prod --dir=dist` with `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID`
— and turn off Netlify's own build for the site.

## Sequencing

1. Template + frontmatter port; prove the cover-image/root question on one
   poem (the only real risk).
2. Wire `settings.mjs`/`job.mjs`/`covers.mjs`; full forced local build;
   parity check.
3. Delete LaTeX files and committed cover PDFs; docs update.
4. Tool-install script + netlify.toml + cache plugin; verify on a deploy
   preview, then merge.
