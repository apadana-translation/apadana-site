import { EleventyRenderPlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";
import markdownItBracketedSpans from "markdown-it-bracketed-spans";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import { stripHtml } from "string-strip-html";
import shortcodes from "./config/shortcodes.mjs";

function byOrder(a, b) {
  return a.data.order - b.data.order;
}

function addOrderedTagCollection(tag) {
  return function (collectionApi) {
    return collectionApi.getFilteredByTag(tag).sort(byOrder);
  };
}

function addAllPoems(flatten) {
  return function (collectionApi) {
    const allPoems = [1, 2, 3, 4].map((chapter) =>
      collectionApi.getFilteredByTag(`chapter-${chapter}`).sort(byOrder)
    );
    return flatten ? allPoems.flat() : allPoems;
  };
}

export default function (config) {
  // Layout aliases
  config.addLayoutAlias("default-flex", "layouts/default-flex.njk");
  config.addLayoutAlias("default", "layouts/default.njk");
  config.addLayoutAlias("homepage", "layouts/homepage.njk");
  config.addLayoutAlias("page-has-notes", "layouts/page-has-notes.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("poem", "layouts/poem.njk");
  config.addLayoutAlias("resources", "layouts/resources.njk");

  // Markdown config
  const mdOptions = {
    html: true,
    typographer: true,
  };
  const attrsOptions = {
    allowedAttributes: ["id", "class", "data-state"],
  };
  const markdownLib = markdownIt(mdOptions)
    .use(markdownItBracketedSpans)
    .use(markdownItAttrs, attrsOptions)
    .use(markdownItFootnote);

  config.setLibrary("md", markdownLib);

  // Pass through to build
  config.addPassthroughCopy("admin");
  config.addPassthroughCopy("src/public");

  // Shortcodes
  config.addNunjucksShortcode("cite", shortcodes.cite);
  config.addNunjucksAsyncShortcode("asset", shortcodes.asset);
  config.addNunjucksAsyncShortcode("image", shortcodes.image);
  config.addNunjucksShortcode("siteUpdateDateTime", shortcodes.siteUpdateDateTime);

  // Filters

  // render markdown to html, strip html tags and line breaks
  // to make safe output for JSON
  config.addNunjucksFilter("jsonify_markdown", (str) => {
    const html = markdownLib.render(str);
    const stripped = stripHtml(html).result;
    return stripped.replace(/\r?\n|\r/g, " ");
  });

  // strip html tags and collapse whitespace, for use with already-rendered content
  config.addNunjucksFilter("strip_html", (str) => {
    return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  });

  // Plugins
  config.addPlugin(EleventyRenderPlugin);

  // Collections
  [1, 2, 3, 4].forEach((chapter) =>
    config.addCollection(
      `chapter-${chapter}`,
      addOrderedTagCollection(`chapter-${chapter}`)
    )
  );
  config.addCollection("allPoems", addAllPoems(true));
  config.addCollection("allPoemsGroupedByChapter", addAllPoems(false));

  return {
    dir: {
      input: "./src",
      output: "./dist",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
