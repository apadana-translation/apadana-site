// Install the pinned pandoc and typst binaries into .cache/bin.
//
// Runs on Netlify (linux-x64) before `yarn build:pandoc`, and works locally
// on macOS too. Idempotent: a tool is skipped when .cache/bin already holds
// its pinned version (tracked via a version stamp file). Because .cache/ is
// persisted by netlify-plugin-cache, CI downloads each pin exactly once.
//
// The pandoc build prepends .cache/bin to PATH (see toolEnv in
// config/pandoc/settings.mjs), so these binaries win over any system ones.

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const binDir = path.join(projectRoot, ".cache", "bin");

// `member` is the binary's path inside the release archive.
const TOOLS = {
  pandoc: {
    version: "3.10",
    targets: {
      "linux-x64": {
        url: "https://github.com/jgm/pandoc/releases/download/3.10/pandoc-3.10-linux-amd64.tar.gz",
        sha256: "e0f8af62d0f267d22baa5bcefe6d5dda3a097ccc60de794b759fe03159923244",
        member: "pandoc-3.10/bin/pandoc",
      },
      "darwin-arm64": {
        url: "https://github.com/jgm/pandoc/releases/download/3.10/pandoc-3.10-arm64-macOS.zip",
        sha256: "d9cad01d96ae774a0dc8c8c45bb1ad3e4c5ff2cc2e24f45958f5f9b7974aee34",
        member: "pandoc-3.10-arm64/bin/pandoc",
      },
    },
  },
  typst: {
    version: "0.15.0",
    targets: {
      "linux-x64": {
        url: "https://github.com/typst/typst/releases/download/v0.15.0/typst-x86_64-unknown-linux-musl.tar.xz",
        sha256: "59b207df01be2dab9f13e80f73d04d7ff8273ffd46b3dd1b9eef5c60f3eeabea",
        member: "typst-x86_64-unknown-linux-musl/typst",
      },
      "darwin-arm64": {
        url: "https://github.com/typst/typst/releases/download/v0.15.0/typst-aarch64-apple-darwin.tar.xz",
        sha256: "fe53838737abf93a774495952a1a797b4686e9c4a21c2d99b9fdf77f46cc3572",
        member: "typst-aarch64-apple-darwin/typst",
      },
    },
  },
};

const platformKey = `${process.platform}-${process.arch}`;

function stampPath(name) {
  return path.join(binDir, `${name}.version`);
}

async function isInstalled(name, version) {
  try {
    const [stamp] = await Promise.all([
      fs.readFile(stampPath(name), "utf8"),
      fs.access(path.join(binDir, name)),
    ]);
    return stamp.trim() === version;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, data);
  return createHash("sha256").update(data).digest("hex");
}

// bsdtar (macOS) reads zip archives too; linux targets are all tarballs.
async function extractMember(archive, member, destDir) {
  await new Promise((resolve, reject) => {
    const proc = spawn("tar", ["-xf", archive, "-C", destDir, member], {
      stdio: "inherit",
    });
    proc.on("error", reject);
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`tar exited ${code}`))
    );
  });
  return path.join(destDir, member);
}

async function install(name, { version, targets }) {
  if (await isInstalled(name, version)) {
    console.log(`${name} ${version} already installed`);
    return;
  }
  const target = targets[platformKey];
  if (!target) throw new Error(`no ${name} pin for platform ${platformKey}`);

  console.log(`installing ${name} ${version} from ${target.url}`);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `${name}-`));
  try {
    const archive = path.join(tmpDir, path.basename(target.url));
    const sha256 = await download(target.url, archive);
    if (sha256 !== target.sha256) {
      throw new Error(
        `${name}: sha256 mismatch\n  expected ${target.sha256}\n  got      ${sha256}`
      );
    }
    const extracted = await extractMember(archive, target.member, tmpDir);
    await fs.mkdir(binDir, { recursive: true });
    await fs.rm(path.join(binDir, name), { force: true });
    await fs.copyFile(extracted, path.join(binDir, name));
    await fs.chmod(path.join(binDir, name), 0o755);
    await fs.writeFile(stampPath(name), `${version}\n`);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

for (const [name, spec] of Object.entries(TOOLS)) {
  await install(name, spec);
}
console.log(`tools ready in ${binDir}`);
