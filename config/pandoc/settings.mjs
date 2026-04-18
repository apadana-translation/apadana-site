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
  covers: src("_assets/covers"),
  fonts: src("_assets/fonts"),
  layouts: src("_includes/layouts"),
  epubMetadata: src("_includes/layouts/epub-metadata.xml"),
  pdfHeader: src("_includes/layouts/pdf-header.tex"),
  pdfFrontmatter: src("_includes/layouts/pdf-frontmatter.tex"),
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
      "--pdf-engine=xelatex",
      "-V", "fontsize=12pt",
      "-V", "documentclass=article",
      "-V", "geometry=hcentering",
      "-V", "geometry=bindingoffset=.2in",
      "-V", "geometry=tmargin=1.2in",
      "-V", "geometry=bmargin=1in",
      "-V", "links-as-notes=true",
      `--include-in-header=${paths.pdfHeader}`,
      `--include-before-body=${paths.pdfFrontmatter}`,
    ],
  },
};

export const concurrency = Math.max(1, os.cpus().length);
