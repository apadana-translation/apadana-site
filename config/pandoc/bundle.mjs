// Concatenate poem markdown bodies into one document.
// No bibliography handling — unused in this book.
export function concatPoems(poems) {
  return poems.map((p) => p.content.trim()).join("\n\n");
}
