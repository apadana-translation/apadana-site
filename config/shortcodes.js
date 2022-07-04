const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

const manifestPath = path.resolve(__dirname, "../dist/assets/manifest.json");
const imageMaxWidth = 700;

function citeShortcode(filename, options) {
  return `<a href="#">future link to "${filename}"</a>`;
}

// Allow embedding webpack assets pulled out from `manifest.json`
// {% webpack "main.css" %}
async function webpackShortcode(name) {
  return new Promise((resolve) => {
    fs.readFile(manifestPath, { encoding: "utf8" }, (err, data) =>
      resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
    );
  });
}

function getSizes(ratio) {
  const breakpoint = imageMaxWidth;
  const maxSize = parseInt(imageMaxWidth * ratio);
  const vwSize = 100 * ratio;
  return `(min-width: ${breakpoint}px) ${maxSize}px, ${vwSize}vw`;
}

async function imageShortcode(src, alt, widths, sizes, sizeRatio = 0.92) {
  const imageDir = "./src/_assets/images";
  const srcWithPath = `${imageDir}/${src}`;
  const metadata = await Image(srcWithPath, {
    widths: widths || [imageMaxWidth, imageMaxWidth / 2],
    urlPath: "/assets/images/",
    outputDir: "./dist/assets/images/",
  });
  const imageAttributes = {
    alt,
    sizes: sizes || getSizes(sizeRatio),
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = {
  cite: citeShortcode,
  webpack: webpackShortcode,
  image: imageShortcode,
};
