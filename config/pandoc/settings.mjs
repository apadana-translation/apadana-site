import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(__dirname, "..", "..");

const categoriesData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "src/_data/categories.json"), "utf8")
);

const src = (p) => path.join(projectRoot, "src", p);
const dist = (p) => path.join(projectRoot, "dist", p);

export const distRoot = path.join(projectRoot, "dist");

// Outputs are built here and hardlinked into dist, so incremental state
// survives `yarn clean` (which removes dist).
export const cacheRoot = path.join(projectRoot, ".cache", "pandoc");

export const paths = {
  src: (p) => src(p),
  dist: (p) => dist(p),
  poems: src("_poems"),
  // Single shared cover for every output, 2448x3168 (~288 DPI at US
  // letter), rasterized from the original vector cover.pdf (in git
  // history at a41ca35^)
  cover: src("_assets/covers/cover.png"),
  fonts: src("_assets/fonts"),
  layouts: src("_includes/layouts"),
  epubMetadata: src("_includes/layouts/epub-metadata.xml"),
  pdfTemplate: path.join(__dirname, "template.typst"),
  pdfFrontmatter: path.join(__dirname, "frontmatter.typ"),
  poemOut: (chapterSlug, poemSlug, ext) =>
    dist(path.join("text", chapterSlug, `${poemSlug}.${ext}`)),
  bundleOut: (slug, ext) => dist(`public/links/walters_${slug}.${ext}`),
  cacheFor: (outPath) => path.join(cacheRoot, path.relative(distRoot, outPath)),
};

export const chapters = [1, 2, 3, 4].map((n) => {
  const tag = `chapter-${n}`;
  return { n, tag, title: categoriesData[tag].name, slug: categoriesData[tag].slug };
});

export const full = {
  title: "Legends of the Buddhist Saints",
  subtitle: "Apadānapāli",
  slug: "legends-of-the-buddhist-saints",
};

export const author = "Jonathan S. Walters";

export const formats = {
  epub: {
    ext: "epub",
    binary: true,
    extraArgs: [
      "--split-level=1",
      `--epub-metadata=${paths.epubMetadata}`,
    ],
  },
  pdf: {
    ext: "pdf",
    binary: true,
    extraArgs: [
      "--pdf-engine=typst",
      // Typst refuses to read files outside its compilation root, and pandoc
      // compiles from a temp dir — root at / so absolute paths (cover image)
      // resolve. Page geometry lives in the template.
      "--pdf-engine-opt=--root=/",
      `--pdf-engine-opt=--font-path=${paths.fonts}`,
      // Only the repo fonts, so local builds cannot silently substitute a
      // system-installed Skolar PE that CI does not have.
      "--pdf-engine-opt=--ignore-system-fonts",
      `--template=${paths.pdfTemplate}`,
      "-V", "mainfont=Skolar PE",
      "-V", "fontsize=12pt",
      `--include-before-body=${paths.pdfFrontmatter}`,
    ],
  },
};

// Pinned pandoc/typst binaries installed by config/ci/install-tools.mjs.
// Prepended to PATH so they win over any system-installed versions; falls
// back to PATH lookup when .cache/bin doesn't exist.
export const binDir = path.join(projectRoot, ".cache", "bin");
export const toolEnv = {
  ...process.env,
  PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ""}`,
};

export const concurrency = Math.max(1, os.cpus().length);
