const { EleventyRenderPlugin } = require("@11ty/eleventy");
const markdownIt = require("markdown-it");
const markdownItBracketedSpans = require("markdown-it-bracketed-spans");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const shortcodes = require("./config/shortcodes");

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

module.exports = function (config) {
  // Layout aliases
  config.addLayoutAlias("default-flex", "layouts/default-flex.njk");
  config.addLayoutAlias("default", "layouts/default.njk");
  config.addLayoutAlias("homepage", "layouts/homepage.njk");
  config.addLayoutAlias("page-has-notes", "layouts/page-has-notes.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("poem", "layouts/poem.njk");
  config.addLayoutAlias("resources", "layouts/resources.njk");

  // Shortcodes

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
  config.addNunjucksAsyncShortcode("webpack", shortcodes.webpack);
  config.addNunjucksAsyncShortcode("image", shortcodes.image);

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
};
