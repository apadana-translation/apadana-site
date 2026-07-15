import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import Image from "@11ty/eleventy-img";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const manifestPath = resolve(__dirname, "../dist/.vite/manifest.json");
const bibPath = resolve(__dirname, "../src/_resources/references.bib");
const imageMaxWidth = 700;

let bibCache = null;

function parseBibtex(content) {
  // Strip Eleventy frontmatter if present
  content = content.replace(/^---[\s\S]*?---\s*/, "");

  const entries = {};
  // Split at each entry start so we don't need to match closing braces
  for (const chunk of content.split(/(?=@\w+\{)/)) {
    const header = chunk.match(/^@(\w+)\{([^,]+),/);
    if (!header) continue;

    const type = header[1].toLowerCase();
    const key = header[2].trim();
    const fields = {};

    // Match field = {value} or field = bare_number
    const fieldRe = /(\w+)\s*=\s*(?:\{([^}]*)\}|(\d+))/g;
    for (const fm of chunk.matchAll(fieldRe)) {
      fields[fm[1].toLowerCase()] = fm[2] !== undefined ? fm[2] : fm[3];
    }

    entries[key] = { type, key, ...fields };
  }

  return entries;
}

async function getBibEntries() {
  if (!bibCache) {
    const content = await readFile(bibPath, "utf8");
    bibCache = parseBibtex(content);
  }
  return bibCache;
}

function formatAuthor(authorStr) {
  // "First Last and First Last" → "Last, First and Last, First"
  return authorStr
    .split(" and ")
    .map((name) => {
      const parts = name.trim().split(" ");
      const last = parts.pop();
      return parts.length ? `${last}, ${parts.join(" ")}` : last;
    })
    .join(", ");
}

function formatCitation(entry, options = {}) {
  const { suppressAuthor = false } = options;
  const parts = [];

  if (!suppressAuthor && entry.author) {
    parts.push(formatAuthor(entry.author) + ".");
  }

  if (entry.type === "article") {
    let ref = `"${entry.title}." <em>${entry.journal}</em> ${entry.volume}`;
    if (entry.number) ref += `, no. ${entry.number}`;
    ref += ` (${entry.year}): ${entry.pages}.`;
    parts.push(ref);
  } else if (entry.type === "incollection") {
    let ref = `"${entry.title}." In <em>${entry.booktitle}</em>`;
    if (entry.editor) ref += `, ed. ${entry.editor}`;
    ref += `. ${entry.publisher}, ${entry.year}`;
    if (entry.pages) ref += `, ${entry.pages}`;
    ref += ".";
    parts.push(ref);
  } else if (entry.type === "phdthesis") {
    parts.push(
      `"${entry.title}." PhD diss., ${entry.school}, ${entry.year}.`
    );
  }

  return parts.join(" ");
}

async function citeShortcode(key, options = {}) {
  const entries = await getBibEntries();
  const entry = entries[key];
  if (!entry) {
    console.warn(`[cite] No bib entry found for key: "${key}"`);
    return `<a href="/resources/">[missing citation: ${key}]</a>`;
  }
  return `<a href="/resources/#${key}">${formatCitation(entry, options)}</a>`;
}

// Resolve hashed asset paths from Vite's manifest.json
// {% asset "main.css" %} or {% asset "main.js" %}
async function assetShortcode(name) {
  try {
    const data = await readFile(manifestPath, { encoding: "utf8" });
    const manifest = JSON.parse(data);
    const entry = Object.values(manifest).find(
      (v) => v.isEntry && v.src?.endsWith("main.js"),
    );
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
