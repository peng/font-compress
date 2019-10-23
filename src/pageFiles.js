const fs = require("fs"),
  { methodCheck, errMethod } = require("./util"),
  path = require("path");

const mime = {
  css: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml"
};

module.exports = function(req, res) {
  if (!methodCheck(req, res, "GET")) return;

  const filePath = req.url.split("/page/")[1];
  fs.readFile(
    path.resolve(__dirname, `./page`) + "/" + filePath,
    (err, fileBuf) => {
      if (err) {
        res.writeHead(500);
        errMethod.serverErr(err, res);
      }
      const extName = path.extname(req.url).split(".")[1];
      // console.log(extName);
      res.writeHead(200, {
        "Content-Type": `${mime[extName] || "text/plain"}`
      });
      res.end(fileBuf);
    }
  );
};
