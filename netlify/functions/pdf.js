const { builder } = require("@netlify/functions");
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

async function toPDF() {
  const doc = new PDFDocument();
  doc.text('Hello, World!');
  doc.end();
  return await getStream.buffer(doc);
}


async function handler(event, context) {
  const [, , type, ...pathSegments] = event.path.split("/");
  const filename = `${pathSegments[pathSegments.length - 1]}.pdf`;

  const pdfBuffer = await toPDF();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: pdfBuffer.toString("base64"),
    isBase64Encoded: true,
  };
}

exports.handler = builder(handler);
