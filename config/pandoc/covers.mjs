import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { paths, chapters, full } from "./settings.mjs";

// Cover basename (without extension) per job.
// - Poems share the default project cover.
// - Chapters and the full set each have their own named cover.
const bundleCoverBase = new Map([
  ...chapters.map((c) => [c.slug, c.slug]),
  [full.slug, full.slug],
]);

function coverBase(job) {
  if (job.kind === "poem") return "cover";
  return bundleCoverBase.get(job.slug) ?? null;
}

export function coverPngFor(job) {
  const base = coverBase(job);
  if (!base) return null;
  return path.join(paths.covers, `${base}.png`);
}

async function mtime(p) {
  try {
    return (await fs.stat(p)).mtimeMs;
  } catch {
    return null;
  }
}

// Ensure a PDF version of the cover exists alongside the PNG.
// Re-generates only if PNG is newer than PDF (or PDF missing).
export async function ensurePdfCover(pngPath) {
  const pdfPath = pngPath.replace(/\.png$/, ".pdf");
  const [pngT, pdfT] = await Promise.all([mtime(pngPath), mtime(pdfPath)]);
  if (pngT == null) return null;
  if (pdfT != null && pdfT >= pngT) return pdfPath;

  await new Promise((resolve, reject) => {
    const proc = spawn("magick", [pngPath, pdfPath], { stdio: "inherit" });
    proc.on("error", reject);
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`magick exited ${code}`))
    );
  });
  return pdfPath;
}
