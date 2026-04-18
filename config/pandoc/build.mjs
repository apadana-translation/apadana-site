import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { buildManifest } from "./manifest.mjs";
import { runJob } from "./job.mjs";
import { loadState, saveState } from "./state.mjs";
import { concurrency } from "./settings.mjs";

function parseFilters(argv) {
  const filters = { formats: null, kinds: null, slugs: null, force: false };
  for (const arg of argv) {
    if (arg === "--force") { filters.force = true; continue; }
    const [k, v] = arg.split("=");
    if (k === "--format") filters.formats = new Set(v.split(","));
    else if (k === "--kind") filters.kinds = new Set(v.split(","));
    else if (k === "--slug") filters.slugs = new Set(v.split(","));
  }
  return filters;
}

function applyFilters(jobs, { formats, kinds, slugs }) {
  return jobs.filter((j) => {
    if (formats && !formats.has(j.format)) return false;
    if (kinds && !kinds.has(j.kind)) return false;
    if (slugs && !slugs.has(j.slug)) return false;
    return true;
  });
}

// Rough cost estimate so the workers start the slowest jobs first: the
// full-set and chapter PDFs take ~30s each and would otherwise run last,
// alone, after every core has gone idle. PDF jobs dwarf epub jobs (xelatex
// startup alone is ~1.5s), so all PDFs sort ahead of all epubs.
function jobCost(job) {
  const bytes = job.poems.reduce((sum, p) => sum + p.content.length, 0);
  return job.format === "pdf" ? 1e9 + bytes : bytes;
}

async function pandocVersion() {
  const { stdout } = await promisify(execFile)("pandoc", ["--version"]);
  return stdout.split("\n", 1)[0];
}

async function runAll(jobs, limit, { force, state, version }) {
  let i = 0;
  let failures = 0;
  let built = 0;
  let skipped = 0;
  const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    while (i < jobs.length) {
      const job = jobs[i++];
      const label = `[${job.format}/${job.kind}] ${job.slug}`;
      try {
        const start = Date.now();
        const result = await runJob(job, { force, state, pandocVersion: version });
        if (result.skipped) {
          skipped++;
        } else {
          built++;
          console.log(`${label} (${Date.now() - start}ms)`);
        }
      } catch (err) {
        failures++;
        console.error(`FAIL ${label}: ${err.message}`);
      }
    }
  });
  await Promise.all(workers);
  return { failures, built, skipped };
}

const filters = parseFilters(process.argv.slice(2));
const [{ jobs }, state, version] = await Promise.all([
  buildManifest(),
  loadState(),
  pandocVersion(),
]);
const filtered = applyFilters(jobs, filters).sort((a, b) => jobCost(b) - jobCost(a));

console.log(`Considering ${filtered.length} of ${jobs.length} jobs at concurrency ${concurrency}${filters.force ? " (forced)" : ""}`);
const { failures, built, skipped } = await runAll(filtered, concurrency, {
  force: filters.force,
  state,
  version,
});
await saveState(state);
console.log(`Done: built ${built}, skipped ${skipped}, failed ${failures}`);
if (failures > 0) process.exit(1);
