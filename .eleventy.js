const markdownIt = require("markdown-it");
const markdownItBracketedSpans = require("markdown-it-bracketed-spans");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const shortcodes = require("./config/shortcodes");

module.exports = function (eleventyConfig) {
  // Layout aliases
  eleventyConfig.addLayoutAlias("default-flex", "layouts/default-flex.njk");
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("homepage", "layouts/homepage.njk");
  eleventyConfig.addLayoutAlias(
    "page-has-notes",
    "layouts/page-has-notes.njk"
  );
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("poem", "layouts/poem.njk");
  eleventyConfig.addLayoutAlias("resources", "layouts/resources.njk");

  // Markdown config
  const mdOptions = {
    html: true,
    typographer: true
  };
  const attrsOptions = {
    allowedAttributes: ["id", "class", "data-state"]
  };
  const markdownLib = markdownIt(mdOptions)
    .use(markdownItBracketedSpans)
    .use(markdownItAttrs, attrsOptions)
    .use(markdownItFootnote);
  
  eleventyConfig.setLibrary("md", markdownLib);

  // Pass through to build
  eleventyConfig.addPassthroughCopy("admin");

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addNunjucksShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  // Collections
  // eleventyConfig.addCollection("allPoems", function(collectionApi) {
  //   const chapter1 = collectionApi.getFilteredByTag("chapter-1");
  //   const chapter2 = collectionApi.getFilteredByTag("chapter-2");
  //   console.log([chapter1, chapter2]);
  //   return chapter1;
  // });

  return {
    dir: {
      input: "./src",
      output: "./dist",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
