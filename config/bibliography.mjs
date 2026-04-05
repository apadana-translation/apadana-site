import { readFile, access } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseBibtex(source) {
  const bibStart = source.indexOf("@");
  if (bibStart === -1) return [];

  const entries = [];
  const chunks = ("\n" + source.slice(bibStart)).split(/\n(?=@)/);

  for (const chunk of chunks) {
    const typeMatch = chunk.match(/^@(\w+)\s*\{/);
    if (!typeMatch) continue;
    const type = typeMatch[1].toLowerCase();
    if (["comment", "string", "preamble"].includes(type)) continue;

    const rest = chunk.slice(typeMatch[0].length);
    const commaIdx = rest.indexOf(",");
    if (commaIdx === -1) continue;

    const key = rest.slice(0, commaIdx).trim();
    const fieldsStr = rest.slice(commaIdx + 1);

    const fields = {};
    const fieldRegex = /(\w+)\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*"|\d+)/g;
    let fm;
    while ((fm = fieldRegex.exec(fieldsStr)) !== null) {
      let val = fm[2];
      if (val.startsWith("{") && val.endsWith("}")) val = val.slice(1, -1);
      else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      fields[fm[1].toLowerCase()] = val;
    }

    entries.push({ type, key, fields });
  }
  return entries;
}

function parseAuthorName(name) {
  name = name.trim();
  if (name.includes(",")) {
    const idx = name.indexOf(",");
    return { last: name.slice(0, idx).trim(), first: name.slice(idx + 1).trim() };
  }
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { last: parts[0], first: "" };
  return { last: parts[parts.length - 1], first: parts.slice(0, -1).join(" ") };
}

// First author inverted (Last, First), rest non-inverted (First Last)
function formatAuthors(authorField) {
  const authors = authorField.split(" and ").map((a) => a.trim());
  const parts = authors.map(parseAuthorName);

  const formatted = parts.map(({ last, first }, i) => {
    if (i === 0) return first ? `${last}, ${first}` : last;
    return first ? `${first} ${last}` : last;
  });

  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]}, and ${formatted[1]}`;
  const last = formatted.pop();
  return `${formatted.join(", ")}, and ${last}`;
}

// All editors non-inverted (First Last) — "Holt, Kinnard" → "Kinnard Holt"
function formatEditors(editorField) {
  const editors = editorField.split(" and ").map((e) => e.trim());
  const formatted = editors.map(parseAuthorName).map(({ last, first }) =>
    first ? `${first} ${last}` : last
  );

  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  const last = formatted.pop();
  return `${formatted.join(", ")}, and ${last}`;
}

function formatMonth(m) {
  if (!m) return "";
  const n = parseInt(m);
  return isNaN(n) ? m : MONTH_NAMES[n - 1] ?? m;
}

// Chicago-style page range compression: 229–240 → 229–40
function compressPages(pages) {
  pages = pages.replace(/-/g, "\u2013"); // normalize hyphen to en-dash
  const m = pages.match(/^(\d+)\u2013(\d+)$/);
  if (!m) return pages;
  const [, start, end] = m;
  if (start.length >= 3 && start.length === end.length) {
    let i = 0;
    while (i < end.length - 2 && start[i] === end[i]) i++;
    if (i > 0) return `${start}\u2013${end.slice(i)}`;
  }
  return pages;
}

// Append period only if the string doesn't already end with one
function withPeriod(s) {
  return s.endsWith(".") ? s : `${s}.`;
}

function sortKey({ fields }) {
  const author = fields.author || "";
  const { last } = parseAuthorName(author.split(" and ")[0].trim());
  const year = parseInt(fields.year) || 0;
  return `${last.toLowerCase()}|${String(year).padStart(4, "0")}`;
}

function formatEntry({ type, fields }) {
  const author = fields.author ? formatAuthors(fields.author) : "";
  const year = fields.year || "";
  const title = fields.title || "";

  switch (type) {
    case "article": {
      const journal = fields.journal ? `<em>${fields.journal}</em>` : "";
      const vol = fields.volume || "";
      const num = fields.number ? `, no.\u00a0${fields.number}` : "";
      const month = formatMonth(fields.month);
      const date = month ? `${month} ${year}` : year;
      const pages = compressPages(fields.pages || "");
      return `${withPeriod(author)} \u201c${title}.\u201d ${journal} ${vol}${num} (${date}): ${pages}.`;
    }
    case "incollection": {
      const book = fields.booktitle ? `<em>${fields.booktitle}</em>` : "";
      const editedBy = fields.editor ? `, edited by ${formatEditors(fields.editor)},` : ",";
      const pub = fields.publisher || "";
      const addr = fields.address || ""; // intentionally ignore typo field 'addres'
      const pages = compressPages(fields.pages || "");
      const place = addr ? `${addr}: ` : "";
      return `${withPeriod(author)} \u201c${title}.\u201d In ${book}${editedBy} ${pages}. ${place}${pub}, ${year}.`;
    }
    case "phdthesis": {
      const school = fields.school || "";
      return `${withPeriod(author)} \u201c${title}.\u201d PhD thesis, ${school}, ${year}.`;
    }
    default:
      return `${withPeriod(author)} \u201c${title}.\u201d ${year}.`;
  }
}

export async function bibliographyShortcode() {
  const bibPath = resolve(__dirname, "../src/_resources/references.bib");
  const linksDir = resolve(__dirname, "../src/public/links");
  const source = await readFile(bibPath, "utf8");
  const entries = parseBibtex(source);
  entries.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  // Determine which entries have local repository PDFs
  const localPdfs = new Set();
  for (const { key } of entries) {
    try {
      await access(resolve(linksDir, `${key}.pdf`));
      localPdfs.add(key);
    } catch {
      // no local PDF for this key
    }
  }

  let prevAuthor = null;
  const items = entries.map((entry) => {
    const { fields, key } = entry;
    const rawAuthor = fields.author || "";

    let citation = formatEntry(entry);

    // Replace repeated author with three em-dashes
    if (rawAuthor && rawAuthor === prevAuthor) {
      const formattedAuthor = withPeriod(formatAuthors(rawAuthor));
      citation = citation.replace(formattedAuthor, "\u2014\u2014\u2014.");
    }
    prevAuthor = rawAuthor;

    // PDF link: prefer local repository file, fall back to url field
    const pdfUrl = localPdfs.has(key)
      ? `/public/links/${key}.pdf`
      : (fields.url || null);
    const pdfLink = pdfUrl
      ? ` [<svg width="20" height="20" class="icon-pdf"><use xlink:href="#icon-pdf"></use></svg><a href="${pdfUrl}"><span class="abbr">PDF</span></a>]`
      : "";

    return `  <li>${citation}${pdfLink}</li>`;
  });

  return `<ol class="bibliography">\n${items.join("\n")}\n</ol>`;
}
