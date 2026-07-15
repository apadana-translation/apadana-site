---
title: Download the Text
permalink: /text/download/
---

<i>{{ site.title }}</i> is made freely available to the public under the <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/us/" title="CC BY-NC-SA 3.0 US" target="_blank">Attribution, Non-Commercial, Share Alike</a> license.

{% set linksDir = "/public/links/" %}
{% set fullSlug = site.title | slug %}

<p>
  <svg width="20" height="20" class="icon--large icon-pdf"><use xlink:href="#icon-pdf"></use></svg>
  <a href="{{ linksDir }}walters_{{ fullSlug }}.pdf" download="{{ site.title }}.pdf" class="button">Download <span class="abbr">PDF</span></a>
</p>
<p>
  <svg width="20" height="20" class="icon--large icon-book-open"><use xlink:href="#icon-book-open"></use></svg>
  <a href="{{ linksDir }}walters_{{ fullSlug }}.epub" download="{{ site.title }}.epub" class="button">Download ePub</a>
</p>

<p>Download individual chapters:</p>
<ol>
  {% for group in collections.allPoemsGroupedByChapter %}
    {% set categoryKey = group[0].data.category %}
    {% set categoryName = categories[categoryKey].name %}
    {% set categorySlug = categories[categoryKey].slug %}
    <li>
      <b>{{ categoryName }}</b>
      [<svg width="20" height="20" class="icon-pdf"><use xlink:href="#icon-pdf"></use></svg>
      <a href="{{ linksDir }}walters_{{ categorySlug }}.pdf" download="{{ loop.index }}. {{ categoryName }}.pdf"><span class="abbr">PDF</span></a>
      <svg class="icon-book-open"><use xlink:href="#icon-book-open"></use></svg>
      <a href="{{ linksDir }}walters_{{ categorySlug }}.epub" download="{{ loop.index }}. {{ categoryName }}.epub">ePub</a>]
    </li>
  {% endfor %}
</ol>

<p>Individual poems may be downloaded through the “Download” tab while reading online.</p>
