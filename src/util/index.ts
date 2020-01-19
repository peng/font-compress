/**
 * @file include some common methods
 * @author peng
 */

import crypto from "crypto";
import { selectData } from "./database";

/**
 * CORS http response headers set
 *
 * @param {Object} response http response Object
 */
function CORS(response: any) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS"
  );
  response.setHeader("X-Powered-By", " 3.2.1");
  response.setHeader("Content-Type", "application/json;charset=utf-8");
}

/**
 * create md5 string
 * 32 bits lower case  32位小写
 *
 * @param {string} data string to md5
 * @return {string} md5 string
 */
function md5(data: string): string {
  const hash = crypto.createHash("md5");
  return hash.update(data).digest("hex");
}

/**
 * check http request method
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {string} method request method that you nedd
 * @return {boolean} return pass or not
 */
function methodCheck(req: any, res: any, method: string): boolean {
  if (req.method !== method) {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("405 error! Method Not Allowed!");
    return false;
  }
  return true;
}

/**
 * authentication user
 *
 * @param {Object} req http request object
 * @param {string} power power of user power have three value 'member', 'admin', 'root'
 * @return {Promise} Promise
 * @resolve {Object} auth author info
 * @resolve {string} auth.desc descript result
 * @resolve {boolean} auth.result return result pass or not
 * @resolve {Object} auth.data return query sql data
 */
function authentication(req, power) {
  /* 
  传入一个 request 对象

   返回
   {
     desc: string,  状态描述
     result: boolean, 布尔状态结果
     data: Object|Array 返回的数据
   }
  */

  /**
   *
   * @param {string} userPower user power that get from database
   * @param {string} needPower need power that interface need
   * @return {Boolean} return true that you have power, return false that you don't have power
   */
  const powerCheck = (userPower, needPower) => {
    let powerNum = {
      root: 3,
      admin: 2,
      member: 1
    };
    if (powerNum[userPower] >= powerNum[needPower]) {
      return true;
    } else {
      return false;
    }
  };

  return new Promise((resolve, reject) => {
    if (!req.headers.hasOwnProperty("cookie")) {
      resolve({
        desc: "user is no power",
        result: false,
        data: {}
      });
      return;
    }

    const cookies = req.headers.cookie.split(";");
    let userCookie = "";
    for (let i = 0; i < cookies.length; i++) {
      const KV = cookies[i].replace(" ", "").split("=");
      if (KV[0] == "toolsite") {
        userCookie = KV[1];
        break;
      }
    }

    selectData(
      "member",
      ["account", "session", "power"],
      `session='${userCookie}'`
    ).then(
      data => {
        if (data.result.length != 1) {
          resolve({
            desc: "user session not found",
            result: false,
            data: data.result
          });
          return;
        }
        if (!powerCheck(data.result[0].power, power)) {
          resolve({
            desc: "user is no power",
            result: false,
            data: data.result
          });
          return;
        }
        resolve({
          desc: "success",
          result: true,
          data: data.result[0]
        });
      },
      err => {
        console.error("authentication select data fail");
        console.error(err);
        reject(err);
      }
    );
  });
}
/**
 * validator account passwords 验证账号密码
 *
 * @const
 * @type {Object}
 */
const validator = {
  /**
   * validator account
   *
   * @param {string} account
   * @return {Object} {
   *   result: {boolean} pass or not,
   *   desc: {string} reason
   * }
   */
  account(account) {
    if (account.length < 4) {
      return {
        result: false,
        desc: "min"
      };
    }
    if (account.length > 25) {
      return {
        result: false,
        desc: "max"
      };
    }

    const reg = /^[a-zA-Z]\w{2,24}$/;
    return {
      result: reg.test(account),
      desc: "reg"
    };
  },
  /**
   * validator password
   *
   * @param {string} password
   * @return {Object} {
   *   result: {boolean} pass or not,
   *   desc: {string} reason
   * }
   */
  password(password) {
    /* 
      6-25个字符串，英文大小写,数字，英文特殊符号
    */
    if (password.length < 6) {
      return {
        result: false,
        desc: "min"
      };
    }

    if (password.length > 25) {
      return {
        result: false,
        desc: "max"
      };
    }

    const reg = /[A-Za-z0-9\!@#\$\%\^\&\*\(\\.\?)]{6,25}$/;
    return {
      result: reg.test(password),
      desc: "reg"
    };
  }
};

/**
 * forbidden -> user no power response
 * serverErr -> server error response
 */
const errMethod = {
  /**
   * user is no power
   *
   * @param {Object} res http response
   */
  forbidden: res => {
    res.end(
      JSON.stringify({
        code: 403,
        desc: "Forbidden"
      })
    );
  },
  /**
   * server have some error
   *
   * @param {Object} err error information
   * @param {Object} res http response object
   */
  serverErr: (err, res) => {
    console.error(err);
    res.end(
      JSON.stringify({
        code: 500,
        desc: "some thing wrong in server!"
      })
    );
  },
  /**
   * user or password is not right
   *
   * @param {Object} res http response object
   */
  userErr: res => {
    res.end(
      JSON.stringify({
        code: 401,
        desc: "user name or password error"
      })
    );
  }
};

module.exports = {
  CORS,
  methodCheck,
  md5,
  validator,
  authentication,
  errMethod
};
