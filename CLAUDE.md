# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

*Legends of the Buddhist Saints* is a web-based interface for reading the first complete English translation of *Apadānapāli* by Dr. Jonathan S. Walters (Whitman College). The site is built with Eleventy (11ty) for static site generation and Vite for asset bundling.

## Commands

```bash
# Development (runs Webpack + Eleventy in parallel with file watching)
yarn dev

# Production build
yarn build

# Decrypt and unzip licensed fonts (required first-time setup)
yarn unpack-fonts

# Debug Eleventy build
yarn debug
```

There are no tests in this project.

## Architecture

The build pipeline has two parallel processes:

1. **Vite** (`vite.config.js`) — bundles `src/_assets/main.js` (entry point that imports SCSS and JS modules) into `dist/assets/`. Produces a `.vite/manifest.json` (at `dist/.vite/manifest.json`) used by Eleventy to resolve hashed asset filenames.
2. **Eleventy** (`.eleventy.js`) — compiles templates from `src/` into `dist/`. Input: `./src`, output: `./dist`.

### Content Structure

Poems are Markdown files under `src/_poems/`, organized into four chapters. Each chapter folder has a JSON data file setting the `chapter-N` tag (e.g., `chapter-1.json`). The root `_poems.json` sets the shared layout and permalink pattern. Eleventy collections `chapter-1` through `chapter-4`, `allPoems`, and `allPoemsGroupedByChapter` are registered in `.eleventy.js`.

Poem frontmatter fields: `title`, `category`, `order` (used for sort order within a chapter).

### Templates

Nunjucks (`.njk`) is the template engine for both HTML and Markdown files. Layouts live in `src/_includes/layouts/`. Layout aliases are registered in `.eleventy.js` (e.g., `"poem"` → `layouts/poem.njk`).

### Shortcodes

Defined in `config/shortcodes.mjs`:
- `{% asset "main.css" %}` / `{% asset "main.js" %}` — resolves hashed asset paths from `dist/.vite/manifest.json`
- `{% image src, alt %}` — generates responsive `<picture>` elements via `@11ty/eleventy-img`
- `{% cite filename %}` — placeholder for citation links
- `{% siteUpdateDateTime %}` — renders current date as a `<time>` element

### Markdown Extensions

The Markdown parser is configured with:
- `markdown-it-bracketed-spans` — `[text]{.class}` syntax
- `markdown-it-attrs` — attribute syntax `{.class #id}`
- `markdown-it-footnote` — footnote syntax `[^1]`

The `jsonify_markdown` Nunjucks filter renders Markdown to HTML then strips tags (used for JSON data output, e.g., search indexes).

### Assets

- **JS**: `src/_assets/js/` — individual feature modules (audio player, search, sidenotes, navigation, etc.) imported via `src/_assets/main.js`
- **CSS**: `src/_assets/css/` — SCSS with `main.scss` as entry; modules in `css/modules/`
- **Fonts**: Licensed fonts are encrypted at rest; run `yarn unpack-fonts` to decrypt and unzip them into the fonts directory

### Site Data

Global site metadata is in `src/_data/site.json`. Navigation structure is in `src/_data/navigation.json`.
