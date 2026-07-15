// https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e

require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const assetPath = path.resolve(__dirname, "./src/_assets");
const input = `${assetPath}/fonts.zip.enc`;
const output = `${assetPath}/fonts.zip`;
const password = process.env.FONT_CRYPT_SECRET_KEY;

function getCipherKey() {
  return crypto.createHash("sha256").update(password).digest();
}

function decrypt() {
  // First, get the initialization vector from the file.
  const readInitVect = fs.createReadStream(input, { end: 15 });

  let initVect;
  readInitVect.on("data", (chunk) => {
    initVect = chunk;
  });

  // Once we’ve got the initialization vector, we can decrypt the file.
  readInitVect.on("close", () => {
    const cipherKey = getCipherKey();
    const readStream = fs.createReadStream(input, { start: 16 });
    const decipher = crypto.createDecipheriv("aes256", cipherKey, initVect);
    const unzip = zlib.createUnzip();
    const writeStream = fs.createWriteStream(output);

    readStream.pipe(decipher).pipe(unzip).pipe(writeStream);

    readStream.on("end", () =>
      console.log(`Decrypted ${input} to ${output} successfully.`)
    );
  });
}

if (fs.existsSync(output)) {
  console.log(`${output} already exists. Skipping decryption…`);
} else {
  decrypt();
}
