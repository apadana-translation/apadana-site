const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const assetPath = path.resolve(__dirname, "./src/_assets");
const input = `${assetPath}/fonts.zip`;
const output = `${assetPath}/fonts`;

async function extractArchive() {
  try {
    const zip = new AdmZip(input);
    zip.extractAllTo(output);
    console.log(`Extracted to ${output} successfully`);
  } catch (error) {
    console.error(error);
  }
}

if (fs.existsSync(output)) {
  console.log(`${output} already exists. Skipping unzip…`);
} else {
  extractArchive();
}
