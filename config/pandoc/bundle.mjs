// Concatenate poem markdown bodies into one document.
// No bibliography handling — unused in this book.
// Footnote labels are document-scoped in pandoc, so the per-poem labels
// ([^1], [^2], ...) must be namespaced or colliding definitions clobber
// each other and every reference resolves to the last poem's note.
// A single poem cannot collide with itself, so its input is left untouched
// to keep the cache digests of the per-poem outputs stable.
export function concatPoems(poems) {
  if (poems.length === 1) return poems[0].content.trim();
  return poems
    .map((p, i) => p.content.trim().replace(/\[\^([^\]\s]+)\]/g, `[^p${i}-$1]`))
    .join("\n\n");
}
