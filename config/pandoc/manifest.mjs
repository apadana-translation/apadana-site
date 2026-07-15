import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { paths, chapters, full, formats } from "./settings.mjs";

async function readPoem(chapter, file) {
  const abs = path.join(paths.poems, chapter.tag, file);
  const raw = await fs.readFile(abs, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: path.basename(file, ".md"),
    title: data.title ?? "Untitled",
    order: Number(data.order ?? 0),
    chapter,
    sourcePath: abs,
    content,
  };
}

async function readChapterPoems(chapter) {
  const dir = path.join(paths.poems, chapter.tag);
  const entries = await fs.readdir(dir);
  const poems = await Promise.all(
    entries
      .filter((f) => f.startsWith("poem-") && f.endsWith(".md"))
      .map((f) => readPoem(chapter, f))
  );
  return poems.sort((a, b) => a.order - b.order);
}

export async function buildManifest() {
  const byChapter = await Promise.all(chapters.map(readChapterPoems));
  const allPoems = byChapter.flat();

  const jobs = [];
  const formatEntries = Object.entries(formats);

  for (const [fmtName, fmt] of formatEntries) {
    // Per-poem jobs
    for (const poem of allPoems) {
      jobs.push({
        kind: "poem",
        format: fmtName,
        outPath: paths.poemOut(poem.chapter.tag, poem.slug, fmt.ext),
        title: poem.title,
        slug: poem.slug,
        poems: [poem],
      });
    }

    // Per-chapter jobs
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      jobs.push({
        kind: "chapter",
        format: fmtName,
        outPath: paths.bundleOut(chapter.slug, fmt.ext),
        title: chapter.title,
        slug: chapter.slug,
        poems: byChapter[i],
      });
    }

    // Full-set job
    jobs.push({
      kind: "full",
      format: fmtName,
      outPath: paths.bundleOut(full.slug, fmt.ext),
      title: full.title,
      slug: full.slug,
      poems: allPoems,
    });
  }

  return { jobs, byChapter, allPoems };
}
