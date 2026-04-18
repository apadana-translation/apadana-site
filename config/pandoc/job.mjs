import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import yaml from "js-yaml";
import { formats, author, projectRoot, distRoot, paths } from "./settings.mjs";
import { concatPoems } from "./bundle.mjs";
import { coverPngFor, ensurePdfCover } from "./covers.mjs";
import { digest, fileDigest } from "./state.mjs";

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function fontFiles() {
  const entries = await fs.readdir(paths.fonts).catch(() => []);
  return entries
    .filter((f) => f.endsWith(".ttf") || f.endsWith(".otf"))
    .sort()
    .map((f) => path.join(paths.fonts, f));
}

function buildMetadata(job) {
  const metadata = { title: job.title, author };
  return `---\n${yaml.dump(metadata)}---\n\n`;
}

function buildArgs(outPath, format, coverArg) {
  const fmt = formats[format];
  const args = ["-f", "markdown", "-o", outPath, ...fmt.extraArgs];
  if (coverArg) args.push(...coverArg);
  return args;
}

async function runPandoc(args, input) {
  return new Promise((resolve, reject) => {
    const proc = spawn("pandoc", args, {
      cwd: projectRoot,
      stdio: ["pipe", "inherit", "inherit"],
      env: { ...process.env, PATH: `/Library/TeX/texbin:${process.env.PATH ?? ""}` },
    });
    proc.on("error", reject);
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`pandoc exited ${code}`))
    );
    proc.stdin.write(input);
    proc.stdin.end();
  });
}

async function runPdfunite(outputs, finalPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn("pdfunite", [...outputs, finalPath], { stdio: "inherit" });
    proc.on("error", reject);
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`pdfunite exited ${code}`))
    );
  });
}

// Hardlink the cached output into dist (copy if linking fails, e.g. across
// filesystems). No-op when dist already points at the cached file.
async function publish(cachePath, outPath) {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const [cached, published] = await Promise.all([
    fs.stat(cachePath),
    fs.stat(outPath).catch(() => null),
  ]);
  if (published && published.ino === cached.ino && published.dev === cached.dev) return;
  await fs.rm(outPath, { force: true });
  try {
    await fs.link(cachePath, outPath);
  } catch {
    await fs.copyFile(cachePath, outPath);
  }
}

export async function runJob(job, { force = false, state, pandocVersion }) {
  let coverArg = null;
  let pdfCoverToMerge = null;
  const fileDeps = [];

  const coverPng = coverPngFor(job);
  if (job.format === "epub") {
    fileDeps.push(paths.epubMetadata);
    if (coverPng) {
      fileDeps.push(coverPng);
      coverArg = ["--epub-cover-image", coverPng];
    }
  } else if (job.format === "pdf") {
    fileDeps.push(paths.pdfHeader, paths.pdfFrontmatter, ...(await fontFiles()));
    if (coverPng) {
      fileDeps.push(coverPng);
      pdfCoverToMerge = await ensurePdfCover(coverPng);
    }
  }

  const input = buildMetadata(job) + concatPoems(job.poems);
  const stateKey = path.relative(distRoot, job.outPath);
  const cachePath = paths.cacheFor(job.outPath);
  const jobDigest = digest([
    pandocVersion,
    JSON.stringify(formats[job.format].extraArgs),
    pdfCoverToMerge ? "cover-merge" : coverArg ? "cover-image" : "no-cover",
    ...(await Promise.all(fileDeps.map(fileDigest))),
    input,
  ]);

  if (!force && state[stateKey] === jobDigest && (await exists(cachePath))) {
    await publish(cachePath, job.outPath);
    return { skipped: true };
  }

  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  if (pdfCoverToMerge) {
    // Render body to a temp, then prepend cover via pdfunite.
    const tmpBody = cachePath.replace(/\.pdf$/, ".body.pdf");
    await runPandoc(buildArgs(tmpBody, job.format, null), input);
    await runPdfunite([pdfCoverToMerge, tmpBody], cachePath);
    await fs.rm(tmpBody, { force: true });
  } else {
    await runPandoc(buildArgs(cachePath, job.format, coverArg), input);
  }

  await publish(cachePath, job.outPath);
  state[stateKey] = jobDigest;
  return { skipped: false };
}
