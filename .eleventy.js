const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

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
    allowedAttributes: ["id", "class"]
  };
  const markdownLib = markdownIt(mdOptions).use(markdownItAttrs, attrsOptions);
  
  eleventyConfig.setLibrary("md", markdownLib);

  return {
    dir: {
      input: "./src",
      output: "./dist",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
