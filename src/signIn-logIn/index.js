const querystring = require("querystring");
const { methodCheck, md5, authentication, errMethod } = require("../util");
const {
  selectData,
  insertData,
  updateData,
  deleteData
} = require("../util/database");

/**
 * add member
 *
 * @param {Object} res http response
 * @param {string} account add member account, should add mark 'account' for sql
 * @param {string} password add member password, should add mark 'password' for sql
 * @param {string} power set member pwoer, should add mark 'password' for sql
 */
function addMember(res, account, password, power = "'member'") {
  selectData("member", ["id"]).then(
    data => {
      // const id = data.result.length;
      if (!(power == "'admin'" || power == "'member'")) {
        res.end(
          JSON.stringify({
            code: 400,
            desc: "param error"
          })
        );
        return;
      }
      const id = data.result[data.result.length - 1].id + 1;
      insertData(
        "member",
        ["id", "account", "password", "power"],
        [id, account, password, power]
      ).then(
        data => {
          res.write(
            JSON.stringify({
              code: 200,
              desc: "success"
            })
          );
          res.end();
        },
        err => {
          console.error(err);
          res.end("insert member error!");
        }
      );
    },
    err => {
      console.error(err);
      res.end("seleData to get new id error!");
    }
  );
}

/**
 * authenticate user name and password
 *
 * @param {Object} info user info include name and password
 * @param {string} info.name user name
 * @param {string} info.password user password
 * @return {Promise} Promose
 * @resolve {Boolean} true is pass, false is not
 * @reject {Object} select database error object
 */
function authUser(info) {
  return new Promise((resolve, reject) => {
    const { name, password } = info;
    selectData(
      "member",
      ["account", "password"],
      `account='${name}' AND password='${password}'`
    ).then(
      seleRes => {
        // console.log(seleRes);
        if (seleRes.result.length == 1) {
          resolve(true);
          return;
        }
        resolve(false);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * change user password
 *
 * @param {Object} info user info include name and new password
 * @param {string} info.name user name
 * @param {string} info.newPassword user new password
 * @return {Promise} Promise
 * @resolve {Boolean} true is success, false is fail
 * @reject {Object} update database error object
 */
function chgPassword(info) {
  return new Promise((resolve, reject) => {
    const { name, newPassword } = info;
    updateData(
      "member",
      [`password='${newPassword}'`],
      `account='${name}'`
    ).then(
      upRes => {
        // console.log(upRes);
        resolve(true);
      },
      err => {
        // console.log(err);
        reject(err);
      }
    );
  });
}

/**
 * log in
 * api
 * request
 * {
 *    account: 'account',
 *    password: 'password'
 * }
 *
 * response
 * {
 *    code: 200, // 200 通过验证； 401 密码错误， 或则未找到用户
 *    desc: success  // if
 * }
 *
 * @param {Object} req http request
 * @param {Object} res http response
 */
function logIn(req, res) {
  if (!methodCheck(req, res, "POST")) return;
  let data = "";
  req
    .on("data", chunk => {
      data += chunk;
    })
    .on("end", () => {
      const { account, password } = JSON.parse(data);
      selectData(
        "member",
        ["account", "password", "power"],
        `account='${account}'`
      ).then(
        data => {
          if (data.result.length == 0) {
            res.write(
              JSON.stringify({
                code: 401,
                desc: "user is not found"
              })
            );
            res.end();
            return;
          }

          if (data.result[0].password !== password) {
            res.write(
              JSON.stringify({
                code: 401,
                desc: "password is wrong"
              })
            );
            res.end();
            return;
          }

          const session = md5(new Date().getTime().toString() + account);
          const power = data.result[0].power;
          updateData(
            "member",
            [`session='${session}'`],
            `account='${account}'`
          ).then(
            data => {
              const hour = 1;
              const expireTime = new Date(
                new Date().getTime() + hour * 60 * 60 * 1000
              ).toUTCString();
              res.writeHead(200, {
                "Set-Cookie": [
                  `toolsite=${session}; Expires=${new Date(expireTime)}`,
                  `power=${power}; Expires=${new Date(expireTime)}`
                ]
              });
              res.write(
                JSON.stringify({
                  code: 200,
                  desc: "success"
                })
              );
              res.end();
            },
            err => {
              console.error(err);
              res.end("login update data error!");
            }
          );
        },
        err => {
          console.error(err);
          res.end("login select data error!");
        }
      );
    });
}

/**
 * api 添加成员接口
 * request  method POST
 * {
 *    user: '用户名',
 *    password: '密码
 * }
 *
 * response
 *
 * {
 *    code: 200,  614已经存在
 *    desc: 'success'
 * }
 *
 * @param {Object} req http request
 * @param {Object} res http response
 */
function signMember(req, res) {
  if (!methodCheck(req, res, "POST")) return;

  let data = "";

  req
    .on("data", chunk => {
      data += chunk;
    })
    .on("end", () => {
      const { user, password } = JSON.parse(data);

      selectData("member", ["account"], `account='${user}'`).then(
        data => {
          if (data.result.length == 0) {
            addMember(res, `'${user}'`, password);
            return;
          }

          res.write(
            JSON.stringify({
              code: 614,
              desc: "user is exist"
            })
          );
          res.end();
        },
        err => {
          // console.error(err);
          // res.end("sign member select data error!");
          errMethod.serverErr(err, res);
        }
      );
    });
}

/* 
首次添加用户管理员接口
逻辑：
先判断是否存在数据表
检查是否有用户名存在 -> 不存在 存入用户名，密码  密码md5加密
  存在  驳回请求

数据表
用户ID 账号 密码 昵称 头像 session 类型权限(admin , member)

api 
post 
{
  'account': '用户名',
  'password': '密码'
}
*/
function signIn(req, res) {
  if (!methodCheck(req, res, "POST")) return;

  let data = "";

  req
    .on("data", chunk => {
      data += chunk;
    })
    .on("end", () => {
      // console.log(querystring.parse(data));
      const { account, password } = JSON.parse(data); //querystring.parse(data);
      selectData("member").then(
        data => {
          if (data.result.length == 0) {
            addMember(res, `'${account}'`, `'${password}'`, "'admin'");
          } else {
            res.write(
              JSON.stringify({
                code: 614,
                desc: "admin is already exist"
              })
            );
            res.end();
          }
        },
        err => {
          console.error(err);
          res.write(
            JSON.stringify({
              code: 500,
              desc: "add admin seleData fail"
            })
          );
          res.end();
        }
      );
    });
}

/**
 * change password interface
 * method POST
 *
 * @param {Object} req http request
 * @param {Object} res http response
 */
function updatePassword(req, res) {
  if (!methodCheck(req, res, "POST")) return; // 验证请求方法
  let data = "";
  req.on("data", chunk => {
    data += chunk;
  });

  req.on("end", () => {
    // 验证权限
    const { name, password, newPassword } = JSON.parse(data);
    authentication(req, "root").then(
      powRes => {
        if (powRes.result) {
          authUser({ name, password }).then(
            userRes => {
              if (userRes) {
                chgPassword({ name, newPassword }).then(
                  chgRes => {
                    res.end(
                      JSON.stringify({
                        code: 200,
                        desc: "success"
                      })
                    );
                  },
                  err => {
                    errMethod.serverErr(err, res);
                  }
                );
              } else {
                errMethod.userErr(res);
              }
            },
            err => {
              errMethod.serverErr(err, res);
            }
          );
        } else {
          errMethod.forbidden(res);
        }
      },
      err => {
        errMethod.serverErr(err, res);
      }
    );
  });
}

/**
 * get member list interface method
 *
 * @param {Object} req http request Object
 * @param {Object} res http response Object
 */
function memberList(req, res) {
  if (!methodCheck(req, res, "GET")) return;
  authentication(req, "root").then(
    powRes => {
      if (powRes.result) {
        selectData("member", ["account", "power"]).then(
          seleRes => {
            for (let i = 0; i < seleRes.result.length; i++) {
              if (seleRes.result[i].power == "root") {
                seleRes.result.splice(i, 1);
                break;
              }
            }
            // console.log(seleRes.result);
            res.end(
              JSON.stringify({
                code: 200,
                desc: "success",
                list: seleRes.result
              })
            );
          },
          err => {
            errMethod.serverErr(err, res);
          }
        );
      } else {
        errMethod.forbidden(res);
      }
    },
    err => {
      errMethod.serverErr(err, res);
    }
  );
}

/**
 * update member power interface
 * method post
 * Content-Type: application/json
 * body -> json data {
 *   "name": "user-name",
 *   "power": "user-power"
 * }
 *
 * @param {Object} req http request method object
 * @param {Object} res http response method object
 */
function updatePower(req, res) {
  if (!methodCheck(req, res, "POST")) return;
  let data = "";
  req.on("data", chunk => {
    data += chunk;
  });
  req.on("end", () => {
    const { name, power } = JSON.parse(data);
    if (name == "admin") {
      errMethod.forbidden(res);
      return;
    }
    authentication(req, "root").then(
      powRes => {
        if (powRes.result) {
          if (!(power == "admin" || power == "member")) {
            res.end(
              JSON.stringify({
                code: 400,
                desc: "param error"
              })
            );
            return;
          }
          updateData("member", [`power='${power}'`], `account='${name}'`).then(
            upRes => {
              res.end(
                JSON.stringify({
                  code: 200,
                  desc: "success"
                })
              );
            },
            err => {
              errMethod.serverErr(err, res);
            }
          );
        } else {
          errMethod.forbidden(res);
        }
      },
      err => {
        errMethod, serverErr(err, res);
      }
    );
  });
}

/**
 * delete member interface
 * method post
 * Content-Type: application/json
 * body -> json data {
 *   "name": "user-name"
 * }
 *
 * @param {Object} req http request method object
 * @param {Object} res http response method object
 */
function memberDel(req, res) {
  if (!methodCheck(req, res, "POST")) return;
  let data = "";
  req.on("data", chunk => {
    data += chunk;
  });
  req.on("end", () => {
    const { name } = JSON.parse(data);
    if (name == "admin") {
      errMethod.forbidden(res);
      return;
    }
    authentication(req, "root").then(
      powRes => {
        if (powRes.result) {
          deleteData("member", `account='${name}'`).then(
            delRes => {
              // console.log(delRes);
              res.end(
                JSON.stringify({
                  code: 200,
                  desc: "success"
                })
              );
            },
            err => {
              errMethod.serverErr(err, res);
            }
          );
        } else {
          errMethod.forbidden(res);
        }
      },
      err => {
        errMethod, serverErr(err, res);
      }
    );
  });
}

module.exports = {
  signIn,
  logIn,
  signMember,
  updatePassword,
  memberList,
  authUser,
  chgPassword,
  updatePower,
  memberDel
};
