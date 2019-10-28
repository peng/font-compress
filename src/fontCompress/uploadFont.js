/**
 * @file upload font file main
 */

const { methodCheck, authentication } = require("../util"),
  querystring = require("querystring"),
  fs = require("fs"),
  path = require("path"),
  { insertData, selectData } = require("../util/database"),
  multiparty = require("multiparty");

/**
 * save file method
 *
 * @param {Object} req http request
 * @return {Promise} Promise
 * @resolve {Array} list file name list
 * @reject {Object} err
 * @reject {Object|Array} err.err error detail info
 * @reject {string} err.desc error description
 */
function saveFile(req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({
      uploadDir: path.resolve(__dirname, "./font")
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject({
          err,
          desc: "form parse error"
        });
        return;
      }
      files = files.file;
      let renameFail = {
          err: [],
          desc: "success"
        },
        renameNum = 0,
        nameList = [];

      function checkLatest() {
        if (renameNum >= files.length) {
          if (renameFail.desc != "success") {
            reject(renameFail);
            return;
          }

          resolve(nameList);
        }
      }

      files.forEach((item, index) => {
        const oldPath =
            path.resolve(__dirname, "./font") +
            "/" +
            item.path.split("/").pop(),
          newPath =
            path.resolve(__dirname, "./font") + "/" + item.originalFilename;
        fs.rename(oldPath, newPath, err => {
          if (err) {
            renameFail.err.push({
              err,
              file: item
            });
            renameFail.desc = "rename fail";
          }
          nameList.push(item.originalFilename);
          renameNum++;
          checkLatest();
        });
      });
    });
  });
}

/**
 * check whether upload file exist or not
 *
 * @param {Object} req http request
 * @return {Promise} Promise
 * @resolve {Object} res
 * @resolve {boolean} res.status result status
 * @resolve {string} res.desc result description
 * @resolve {number} res.code result code like http status code
 */
function check(req) {
  return new Promise((resolve, reject) => {
    let result = {
      status: false, // exist is false
      desc: "font is exist",
      code: 614
    };
    const filename = querystring.parse(req.headers["content-disposition"])
      .filename;
    if (filename.split(".")[1] != "ttf") {
      resolve({
        status: false,
        desc: "file is not ttf",
        code: 415
      });
      return;
    }
    selectData("font", ["id", "name"]).then(
      res => {
        // console.log(res);
        const list = res.result;
        for (let i = 0; i < list.length; i++) {
          if (list[i].name == filename) {
            resolve(result);
            return;
          }
        }
        result = {
          status: true,
          desc: "font is not exist",
          code: 200,
          maxId: list.length == 0 ? 0 : list.pop().id
        };
        resolve(result);
      },
      err => {
        reject({
          err,
          desc: "select data fail"
        });
      }
    );
  });
}

module.exports = function(req, res) {
  if (!methodCheck(req, res, "POST")) return;
  authentication(req, "member").then(
    powerRes => {
      if (powerRes.result == true) {
        check(req).then(
          result => {
            // console.log(result);
            if (result.status) {
              // is not exist
              saveFile(req).then(
                saveRes => {
                  saveRes.forEach(filename => {
                    let totalNum = 0,
                      errList = [];

                    function checkFinish() {
                      if (totalNum >= saveRes.length) {
                        if (errList.length == 0) {
                          res.write(
                            JSON.stringify({
                              code: 200,
                              desc: "success"
                            })
                          );
                          res.end();
                        } else {
                          res.write(
                            JSON.stringify({
                              code: 500,
                              desc: "some thing error"
                            })
                          );
                          res.end();
                        }
                      }
                    }

                    insertData(
                      "font",
                      ["id", "name", "type", "path"],
                      [
                        ++result.maxId,
                        `'${filename}'`,
                        `'${filename.split(".")[1]}'`,
                        `'${path.resolve(__dirname, "./font")}/${filename}'`
                      ]
                    ).then(
                      insertRes => {
                        totalNum++;
                        checkFinish();
                      },
                      err => {
                        errList.push(err);
                        totalNum++;
                        checkFinish();
                      }
                    );
                  });
                },
                err => {
                  console.error(err);
                  res.end({
                    code: 500,
                    desc: "some thing error"
                  });
                }
              );
            } else if (result.code == 614) {
              // is exist
              res.write(
                JSON.stringify({
                  code: 614,
                  desc: "font is exist"
                })
              );
              res.end();
            } else {
              res.end(
                JSON.stringify({
                  code: result.code,
                  desc: result.desc
                })
              );
            }
          },
          err => {
            console.log(err.desc);
            res.end(
              JSON.stringify({
                code: 500,
                desc: "some thing error"
              })
            );
          }
        );
      } else {
        res.end(
          JSON.stringify({
            code: 401,
            desc: "forbidden"
          })
        );
      }
    },
    err => {
      res.end(
        JSON.stringify({
          code: 500,
          desc: "some thing wrong"
        })
      );
    }
  );
};
