---
title: Download the Text
permalink: /text/download/
---

<p><i>{{ site.title }}</i> is made freely available to the public under the <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/us/" title="CC BY-NC-SA 3.0 US" target="_blank">Attribution, Non-Commercial, Share Alike</a> license.</p>

{% set path_to_folder = site.url + "/public/links/" %}

{# Complete text in PDF and ePub #}
<p>
  <svg width="20" height="20" class="icon--large icon-pdf"><use xlink:href="#icon-pdf"></use></svg>
  <a href="{{ path_to_folder }}walters_{{ site.title | slug }}.pdf"  title="Download PDF of {{ site.title }}" data-download="{{ site.title }} PDF" class="button">Download <abbr>PDF</abbr></a>
</p>
<p>
  <svg width="20" height="20" class="icon--large icon-book-open"><use xlink:href="#icon-book-open"></use></svg>
  <a href="{{ path_to_folder }}walters_{{ site.title | slug }}.epub"  title="Download ePub of {{ site.title }}" data-download="{{ site.title }} ePub" class="button">Download ePub</a>
</p>

{# Single sections in PDF and ePub #}
<p>Download individual chapters:</p>
<ol>
  {# Stupid, tedious way to do this -- fix when not an idiot! #}
  {# {% set chapters = site.poems | groupby("category") | sort() %}
  {% for chapter in chapters %}
    {% set chapter_number = chapter.name | remove: "chapter-" | append: ". " %}
    {% set category_slug = chapter.name %}
    {% set category = site.data.categories[category_slug] %}
    <li><b>{{ category.name }}</b> [<svg width="20" height="20" class="icon-pdf"><use xlink:href="#icon-pdf"></use></svg><a href="{{ path_to_folder }}walters_{{ category.name | slugify }}.pdf" title="Download PDF of {{ chapter_number }}{{ category.name }}" data-download="{{ chapter_number }}{{ category.name }} PDF"><abbr>PDF</abbr></a> <svg class="icon-book-open"><use xlink:href="#icon-book-open"></use></svg> <a href="{{ path_to_folder }}walters_{{ category.name | slugify }}.epub"  title="Download ePub of {{ chapter_number }}{{ category.name }}" data-download="{{ chapter_number }}{{ category.name }} ePub">ePub</a>]</li>
  {% endfor %} #}
</ol>

<p>Individual poems may be downloaded through the “Download” tab while reading online.</p>
