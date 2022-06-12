---
title: Download the Text
permalink: /text/download/
---

<i>{{ site.title }}</i> is made freely available to the public under the <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/us/" title="CC BY-NC-SA 3.0 US" target="_blank">Attribution, Non-Commercial, Share Alike</a> license.

{% set path_to_folder = site_url + "/public/links/" %}

{# Complete text in PDF and ePub #}
<p>
  <svg width="20" height="20" class="icon--large icon-pdf"><use xlink:href="#icon-pdf"></use></svg>
  <a href="{{ path_to_folder }}walters_{{ site.title | slug }}.pdf" download="{{ site.title }}.pdf" class="button">Download <span class="abbr">PDF</span></a>
</p>
<p>
  <svg width="20" height="20" class="icon--large icon-book-open"><use xlink:href="#icon-book-open"></use></svg>
  <a href="{{ path_to_folder }}walters_{{ site.title | slug }}.epub" download="{{ site.title }}.epub" class="button">Download ePub</a>
</p>

{# Single sections in PDF and ePub #}
<p>Download individual chapters:</p>
<ol>
  {# Stupid, tedious way to do this -- fix when not an idiot! #}
  {# {% set chapters = site.poems | groupby("category") | sort() %}
  {% for chapter in chapters %}
    {% set chapter_number = chapter.name | remove: "chapter-" | append: ". " %}
    {% set category_slug = chapter.name %}
    {% set category = categories[category_slug] %}
    <li><b>{{ category.name }}</b> [<svg width="20" height="20" class="icon-pdf"><use xlink:href="#icon-pdf"></use></svg><a href="{{ path_to_folder }}walters_{{ category.name | slug }}.pdf" download="{{ chapter_number }}{{ category.name }}.pdf"><span class="abbr">PDF</span></a> <svg class="icon-book-open"><use xlink:href="#icon-book-open"></use></svg> <a href="{{ path_to_folder }}walters_{{ category.name | slug }}.epub" download="{{ chapter_number }}{{ category.name }}.epub">ePub</a>]</li>
  {% endfor %} #}
</ol>

<p>Individual poems may be downloaded through the “Download” tab while reading online.</p>
