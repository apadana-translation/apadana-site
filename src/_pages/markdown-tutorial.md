---
title: Markdown Tutorial
eleventyExcludeFromCollections: true
permalink: /markdown-tutorial
layout: page
excerpt: This page is designed to provide an introduction and reference for
  editing poems and pages.
---

The Apadāna website encodes all text content in the Markdown syntax. Markdown is for the most part just plain text. But it allows for the creation of basic HTML, as well, by using a handful of special characters.

Some characters are used inline, wrapping words or phrases, such as to italicize or bold text. Other characters are used at the beginning of new lines to indicate a block-level tag, such as a heading or blockquote. It is also perfectly acceptable, though atypical, to use regular HTML in Markdown files.

You will see all of these aspects of Markdown in the pages and poems that make up the Apadāna site. Some of them are common Markdown syntax. Others are more obscure, or tags I’ve created specially for the unique requirements of the site. Using Netlify CMS, I’ve set up a backend interface to allow for the editing of all content on the site.

This page is designed to provide an introduction to working on these pages and a reference to which you can return during editing. It covers 1) common tags used in Markdown, and 2) syntax patterns unique to this website. Follow along with the split-screen display in the text editor to see what the raw text input looks like (lefthand side) and how it will ultimately appear on the website (righthand side).

## Common Markdown tags

\*italics\*: wrap a word or phrase in \* characters to *italicize it*

\*\*bold\*\*: use double \*\* characters for **bold text**

\*\*\*italics and bold\*\*\*: triple \*\*\* will ***italicize and bold text***

\~\~strikethrough\~\~: double tildes will ~~strike through your text~~

\[link text\]\(url\): create a hyperlink by putting the linked text in square brackets, followed by the URL in parentheses, like [this link](/)

\- unordered list: start a series of lines with dashes to indicate an unordered list.
  - item A
  - item B

1\. ordered list: ordered lists are denoted with a number at the start of each line.
  1. item 1
  2. item 2

\>: start and new line with a caret to create a blockquote, like this:
  > This is a blockquote.

\# Heading level 1

\#\# Heading level 2

\#\#\# Heading level 3

See [this tutorial on GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for a complete guide to common Markdown syntax.

## Footnotes

Footnotes are called out specifically here, as they are one of the most common and important of Markdown tags on the Apadāna site.

Footnote markers are denoted inline with square brackets and a circumflex accent before the note number, e.g. \[\^1\].

The notes themselves are compiled at the end of the file, with each note on a new line and beginning with the corresponding number wrapped in the same syntax as the marker. The number should then be followed by a colon. For instance,

\[\^1\]: This is the text of footnote #1.

Following this syntax creates a link between the marker and the footnote, allowing people to click back and forth with ease between the two.

## Escaping characters

There are times when you need to use characters that signify things in Markdown, but you don’t want to use them with any such meaning. A common instance is square brackets (\[\]). In Markdown these indicate the start of a link, but they are used often in the poems of the Apadāna to indicate verse numbers.

To use these characters without additional meaning, you need to “escape” them using a backslash (\\). (See how even a backslash itself needs to be escaped!)

For instance:
  > through what causes do they become \[so\], Hero?”[^2] \[1\][^3]

Note that the brackets denoting footnote references are left unescaped so that Markdown recognizes them as such.

## Diacritics

The feature I’ve created to allow diacritics to be toggled on and off in the text relies on the use of a particular markup pattern:

*rohi[cc]{.diacritics data-state=on}[chch]{.no-diacritics data-state=off}a*

This example displays “*rohicca*” when the toggle is on, and “*rohichcha*” when it is off. The general pattern is that diacritical characters are wrapped in square brackets and followed by “.diacritics data-state=on” in curly brackets (e.g. “[cc]{.diacritics data-state=on}”). The non-diacritical replacement characters come directly after are indicated similiarly but with “.no-diacritics data-state=off” in curly brackets. It’s a bit tricky to understand at first, but this markup pattern is essential for allowing the toggle mechanism to recognize what text to show and hide when the toggle is used.

## Line Breaks

If you look closely, you’ll notice that each line in a poem **ends with two spaces**. This is Markdown’s way of doing a soft return, which creates a new line, rather than a hard return, which creates a new paragraph. Note that this isn’t necessary on the last line of a verse, however, since we do want a new paragraph. Use two returns to keep verses visually separated in the code.

## Wrapping Up

The Apadāna website and supporting repository were developed with the belief that the translations therein would enjoy the greatest longevity and utility by being encoded in plain text, separate from the actual pages of the website. Markdown supports this goal by providing a bare minimum set of markup tags, and I’ve added a very small amount of additional syntax to enable the interactive features of the website. My hope is that it will prove straightforward to edit the poems and pages moving forward, with this guide serving to answer any questions you might have. Happy editing!
