/**
 * @file api  get compressed file
 */

const { selectData } = require("../util/database");
const fs = require("fs");
const { methodCheck } = require("../util");

module.exports = function(req, res, name) {
  if (!methodCheck(req, res, "GET")) return;
  selectData("FONT_CACHE", ["name", "cachePath"], `name='${name}'`).then(
    data => {
      // console.log(data.result);
      const cachePath = data.result[0].cachePath;
      fs.readFile(cachePath, (err, data) => {
        if (err) {
          console.error(err);
          res.end("some thing wrong!");
          return;
        }
        // console.log(data);
        res.write(data);
        res.end();
      });
    },
    err => {
      if (err) {
        console.error(err);
        res.end("some thing wrong!");
      }
    }
  );
};
