const fs = require("fs"),
  { methodCheck, errMethod } = require("./util"),
  path = require("path");

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
      if (/index.html/.test(req.url)) {
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8"
        });
      }

      res.end(fileBuf);
    }
  );
};
