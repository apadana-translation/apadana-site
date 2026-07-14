# Legends of the Buddhist Saints

This is the primary repository for the online publication of [*Legends of the Buddhist Saints*](http://apadanatranslation.org/), a translation of *Apadānapāli* by Dr. Jonathan S. Walters, Whitman College.

This project is under active development. For questions, contact [Dana Johnson](mailto:dana@castironcoding.com).

## Requirements

- Node.js 24
- Yarn 4 (via Corepack; see `packageManager` in `package.json`)
- [Pandoc](https://pandoc.org/) and [Typst](https://typst.app/) (only for generating the PDF/EPUB downloads) — `yarn install-tools` downloads pinned copies into `.cache/bin`, so no system install is needed

## Setup

```sh
yarn install
yarn unpack-fonts
```

The site's licensed fonts are encrypted at rest. `yarn unpack-fonts` decrypts and unzips them, and requires the `FONT_CRYPT_SECRET_KEY` environment variable (a `.env` file works).

## Development

```sh
yarn dev
```

This runs Vite (asset bundling) and Eleventy (static site generation) in parallel with file watching, serving the site at <http://localhost:8080/>.

## Building

```sh
yarn build       # production site build (Vite + Eleventy) into dist/
yarn build:pandoc  # PDF/EPUB downloads via Pandoc
yarn build:all   # both
```

The Pandoc build is incremental: a content-hash cache in `.cache/pandoc` skips unchanged outputs. It accepts `--format=pdf,epub`, `--kind=...`, `--slug=...`, and `--force` flags, e.g. `yarn build:pandoc --format=epub`.

## Deployment

Netlify runs the full build, including the PDF/EPUB downloads (see `netlify.toml`): it decrypts the fonts (`FONT_CRYPT_SECRET_KEY` must be set in the site's environment), installs the pinned Pandoc and Typst binaries, and builds the site plus downloads. `netlify-plugin-cache` persists `.cache/` between builds, so only outputs whose content changed are regenerated.
