import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { cacheRoot } from "./settings.mjs";

// Maps each output path (relative to dist) to a digest of everything that
// produced it: the assembled pandoc input, the pandoc arguments, referenced
// files (covers, metadata, LaTeX includes, fonts), and the pandoc version.
// Content-based, so git checkouts and branch switches that touch mtimes
// without changing content do not trigger rebuilds.
const stateFile = path.join(cacheRoot, "state.json");

export async function loadState() {
  try {
    return JSON.parse(await fs.readFile(stateFile, "utf8"));
  } catch {
    return {};
  }
}

export async function saveState(state) {
  await fs.mkdir(cacheRoot, { recursive: true });
  await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
}

export function digest(parts) {
  const hash = crypto.createHash("sha256");
  for (const part of parts) hash.update(part);
  return hash.digest("hex");
}

// Files (fonts, covers, includes) are shared across many jobs; hash each
// at most once per run.
const fileDigests = new Map();

export function fileDigest(p) {
  if (!fileDigests.has(p)) {
    fileDigests.set(
      p,
      fs.readFile(p).then(
        (buf) => digest([buf]),
        () => `missing:${p}`
      )
    );
  }
  return fileDigests.get(p);
}
