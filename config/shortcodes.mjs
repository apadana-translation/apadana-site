import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import Image from "@11ty/eleventy-img";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const manifestPath = resolve(__dirname, "../dist/.vite/manifest.json");
const imageMaxWidth = 700;

function citeShortcode(filename, options) {
  return `<a href="#">future link to "${filename}"</a>`;
}

// Resolve hashed asset paths from Vite's manifest.json
// {% asset "main.css" %} or {% asset "main.js" %}
async function assetShortcode(name) {
  try {
    const data = await readFile(manifestPath, { encoding: "utf8" });
    const manifest = JSON.parse(data);
    const entry = Object.values(manifest).find((v) => v.isEntry);
    if (!entry) return `/assets/${name}`;
    if (name === "main.js") return "/" + entry.file;
    if (name === "main.css") return "/" + (entry.css?.[0] ?? name);
    return `/assets/${name}`;
  } catch {
    return `/assets/${name}`;
  }
}

function getSizes(ratio) {
  const breakpoint = imageMaxWidth;
  const maxSize = parseInt(imageMaxWidth * ratio);
  const vwSize = 100 * ratio;
  return `(min-width: ${breakpoint}px) ${maxSize}px, ${vwSize}vw`;
}

async function imageShortcode(src, alt, widths, sizes, sizeRatio = 0.92) {
  const imageDir = "./src/_assets/images";
  const srcWithPath = `${imageDir}/${src}`;
  const metadata = await Image(srcWithPath, {
    widths: widths || [imageMaxWidth, imageMaxWidth / 2],
    urlPath: "/assets/images/",
    outputDir: "./dist/assets/images/",
  });
  const imageAttributes = {
    alt,
    sizes: sizes || getSizes(sizeRatio),
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

function siteUpdateDateShortcode() {
  const date = new Date();

  function formatDate() {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date);
  }

  return `<time datetime="${date.toISOString()}">${formatDate()}</time>`;
}

export default {
  cite: citeShortcode,
  asset: assetShortcode,
  image: imageShortcode,
  siteUpdateDateTime: siteUpdateDateShortcode,
};
