// Copyright page, inserted between the title page and the text via
// pandoc --include-before-body (Typst port of the former
// pdf-frontmatter.tex). The printed date honors SOURCE_DATE_EPOCH.

#pagebreak()
#align(bottom)[
  Copyright © #datetime.today().year() Jonathan S. Walters.

  #smallcaps[Published by Jonathan S. Walters and Whitman College]

  #link("http://www.apadanatranslation.org")

  Licensed under the Attribution, Non-Commercial, Share Alike
  (#smallcaps[CC BY-NC-SA 4.0]) license
  (#link("https://creativecommons.org/licenses/by-nc-sa/4.0/")).

  _Printed #datetime.today().display("[month repr:long] [year]")_
]
#pagebreak()
