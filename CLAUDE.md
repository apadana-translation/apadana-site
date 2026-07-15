# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

*Legends of the Buddhist Saints* is a web-based interface for reading the first complete English translation of *Apadānapāli* by Dr. Jonathan S. Walters (Whitman College). The site is built with Eleventy (11ty) for static site generation and Vite for asset bundling. Requires Node 24 and Yarn 4.

## Commands

```bash
# Development (runs Vite and Eleventy in parallel with file watching)
yarn dev

# Production build (Vite + Eleventy)
yarn build

# Download pinned pandoc + typst binaries into .cache/bin (first-time setup)
yarn install-tools

# Generate PDF/EPUB downloads via Pandoc (PDFs rendered with Typst)
yarn build:pandoc

# Site build plus PDF/EPUB generation
yarn build:all

# Remove dist/
yarn clean

# Decrypt and unzip licensed fonts (required first-time setup)
yarn unpack-fonts

# Debug Eleventy build
yarn debug
```

There are no tests in this project.

## Architecture

The build pipeline has two parallel processes:

1. **Vite** (`vite.config.js`) — bundles `src/_assets/main.js` (entry point that imports the site CSS and JS) into `dist/assets/`. Produces a manifest at `dist/.vite/manifest.json` used by Eleventy to resolve hashed asset filenames.
2. **Eleventy** (`eleventy.config.mjs`) — compiles templates from `src/` into `dist/`. Input: `./src`, output: `./dist`. Passthrough-copies `src/admin/config.yml` and `src/public/`.

### Content Structure

Poems are Markdown files under `src/_poems/`, organized into four chapters. Each chapter folder has a JSON data file setting the `chapter-N` tag (e.g., `chapter-1.json`). The root `_poems.json` sets the shared layout and permalink pattern. Eleventy collections `chapter-1` through `chapter-4`, `allPoems`, and `allPoemsGroupedByChapter` are registered in `eleventy.config.mjs`.

Poem frontmatter fields: `title`, `category`, `order` (used for sort order within a chapter).

Standalone pages live in `src/_pages/`. `src/_data/categories.json` is the single source of truth for poem categories. Slugs and filenames used in URLs are ASCII-only (diacritics stripped); display names keep their diacritics.

### PDF/EPUB Generation

`config/pandoc/build.mjs` generates the downloadable PDF and EPUB editions with Pandoc (PDFs via `--pdf-engine=typst`; the page layout, running heads, and cover page live in `config/pandoc/template.typst`, the copyright page in `config/pandoc/frontmatter.typ`). Jobs cover the full set, per-chapter, and per-poem outputs; every output shares the single cover `src/_assets/covers/cover.png` (rendered from `cover.svg`, the design master), embedded by the template for PDFs and passed as `--epub-cover-image` for EPUBs. Pandoc and Typst run from pinned binaries in `.cache/bin`, installed by `config/ci/install-tools.mjs` (`yarn install-tools`); system binaries are a fallback. The build is incremental: a content-hash cache in `.cache/pandoc` skips unchanged jobs (the cache survives `yarn clean`, but changes to the build scripts themselves are not detected — use `--force`). Filter flags: `--format=pdf,epub`, `--kind=...`, `--slug=...`, `--force`.

Netlify runs the whole thing on deploy (`netlify.toml`): fonts are decrypted with `FONT_CRYPT_SECRET_KEY`, tools installed, then `yarn build:all`; `netlify-plugin-cache` persists `.cache/` across builds.

### Templates

Nunjucks (`.njk`) is the template engine for both HTML and Markdown files. Layouts live in `src/_includes/layouts/`. Layout aliases are registered in `eleventy.config.mjs` (e.g., `"poem"` → `layouts/poem.njk`).

### Shortcodes

Defined in `config/shortcodes.mjs`:
- `{% asset "main.css" %}` / `{% asset "main.js" %}` — resolves hashed asset paths from `dist/.vite/manifest.json`
- `{% image src, alt %}` — generates responsive `<picture>` elements via `@11ty/eleventy-img`
- `{% cite key %}` — renders a formatted citation from `src/_resources/references.bib`, linked to `/resources/#key`
- `{% siteUpdateDateTime %}` — renders current date as a `<time>` element

`{% bibliography %}` (from `config/bibliography.mjs`) renders the full bibliography from the same BibTeX file.

### Markdown Extensions

The Markdown parser is configured with:
- `markdown-it-bracketed-spans` — `[text]{.class}` syntax
- `markdown-it-attrs` — attribute syntax `{.class #id}` (allowed attributes: `id`, `class`, `data-state`)
- `markdown-it-footnote` — footnote syntax `[^1]`

Nunjucks filters: `jsonify_markdown` renders Markdown to HTML then strips tags (used for JSON data output, e.g., search indexes); `strip_html` strips tags and collapses whitespace in already-rendered content.

### Assets

- **JS**: `src/_assets/js/` — individual feature modules (audio player, search, sidenotes, navigation, modal, share, etc.) imported via `src/_assets/js/main.js`
- **CSS**: `src/_assets/css/` — plain CSS processed with PostCSS (`postcss-import`, `postcss-nesting`); `main.css` is the entry, modules in `css/modules/`
- **Fonts**: Licensed fonts are encrypted at rest (`src/_assets/fonts.zip.enc`); `yarn unpack-fonts` decrypts (requires `FONT_CRYPT_SECRET_KEY` in the environment or `.env`) and unzips them into the fonts directory

### CMS

Content is editable through Decap CMS at `/admin/` (configuration in `src/admin/config.yml`). The admin page is an Eleventy template (`src/admin/index.njk`) that loads the CMS app from the unpkg CDN and registers the preview styles, resolving the site stylesheet via the `asset` shortcode. See the README for running the CMS against a local repository.

### Site Data

Global site metadata is in `src/_data/site.json`. Navigation structure is in `src/_data/navigation.json`. Poem categories are in `src/_data/categories.json`. `src/_data/site_url.mjs` resolves the site URL per environment.
