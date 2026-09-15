-- Pandoc's Typst writer escapes markup-significant characters (=, -, +, /)
-- at the start of a line, but not at the start of a footnote body, which
-- it emits inline as `#footnote[...]`. Typst treats the first character
-- after the opening bracket as a line start, so a note beginning with "="
-- renders as a level-one heading (large bold text, no note number).
-- Escape such a leading token ourselves. Typst only recognizes these
-- markers when followed by whitespace, so only a Str made entirely of
-- marker characters (the following inline is then a Space) needs it.
if FORMAT ~= "typst" then return {} end

local function escapeLeading(inlines)
  local first = inlines[1]
  if first and first.t == "Str" and first.text:match("^[=+/-]+$") then
    inlines[1] = pandoc.RawInline("typst", "\\" .. first.text)
  end
end

function Note(note)
  local block = note.content[1]
  if block and (block.t == "Para" or block.t == "Plain") then
    escapeLeading(block.content)
    return note
  end
end
