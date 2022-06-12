module.exports = function () {
  console.log(process.env.SITE_URL);
  return process.env.SITE_URL || "http://apadanatranslation.org";
};
