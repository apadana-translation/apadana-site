---
title: Markdown Tutorial
eleventyExcludeFromCollections: true
---

The Apadāna website encodes all text content in the Markdown syntax. For the most part, Markdown is just text. But it allows for the creation of basic HTML, as well, using a handful of special characters. Some characters are used inline, wrapping words or phrases, such as to italicize or bold text. Other characters are used at the beginning of new lines to indicate a block-level tag, such as a heading or blockquote. It is also possible, though much less common, to use regular HTML in Markdown files.

You will see all of these aspects of Markdown in the pages and poems that make up the Apadāna site. Some of them are common Markdown syntax. Others are more obscure, or tags I’ve created specially for the unique requirements of the site. Using Netlify CMS, I’ve set up a backend interface to allow for the editing of all content on the site. This page is designed to provide an introduction to working on these pages and a reference to which you can return during your work.

## Common Markdown tags

* \*italics\*: wrap a word or phrase in `*` characters to *italicize it*
* \*\*bold\*\*: use double `**` characters for **bold text**
* \*\*\*italics and bold\*\*\*: triple `***` will ***italicize and bold text***
* \~\~strikethrough\~\~: double tildes will ~~strike through your text~~
* \[link text\]\(url\): create a hyperlink by putting the linked text in square brackets, followed by the URL in parenthesis, like [this link](/)
* \- unordered list: start a series of lines with dashes to indicate an unordered list.
  - item A
  - item B
* \1\. ordered list: ordered lists are denoted with a number at the start of each line.
  1. item 1
  2. item 2
* \>: start and new line with a caret to create a blockquote, like this:
  > This is a blockquote.
* \# Heading level 1
* \#\# Heading level 2
* \#\#\# Heading level 3

See [this tutorial on GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for a more complete guide to common Markdown syntax.

## Footnotes

Footnotes are called out specifically here, as they are one of the most common and important of Markdown tags on the Apadāna site.

Footnote markers are denoted inline with square brackets and a circumflex accent before the note number, e.g. \[\^1\].

The notes themselves are compiled at the end of the file, with each note on a new line and beginning with the corresponding number wrapped in the same syntax as the marker. The number should then be followed by a colon. For instance,

\[\^1\]: This is the text of footnote #1.

Following this syntax creates a link between the marker and the footnote, allowing people to click back and forth with ease between the two.

## Escaping characters

There are times when you need to use characters that signify things in Markdown, but you want to use them without any such meaning. A common instance are square brackets (\[\]). These typically indicate the start of a link, but are used often in the poems of the Apadāna to indicate things like verse numbers.

To use these characters without additional meaning, you need to “escape” them using a backslash (`\`).

For instance:
  > through what causes do they become \[so\], Hero?”[^2] \[1\][^3]

  *Note that the brackets denoting footnote references are left unescaped so that Markdown recognizes them as such.*

## Diacritics

Toggling diacritics on and off in the text relies on use of a particular markup pattern that looks like this:

*rohi[cc]{.diacritics data-state=on}[chch]{.no-diacritics data-state=off}a*

This example displays “*rohicca*” when the toggle is on, and “*rohichcha*” when it is off. The general pattern is that diacritical characters are wrapped in square brackets and followed by `.diacritics data-state=on` in curly brackets (`[cc]{.diacritics data-state=on}`). The non-diacritical replacement characters come directly after are indicated similiarly but with `.no-diacritics data-state=off` in curly brackets. This convoluted markup produces HTML that the toggle mechanism is able to understand to show/hide the diacritics.
