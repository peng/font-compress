const crypto = require('crypto');
const { selectData } = require('./database');

function CORS(response) {
  // CORS 跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  response.setHeader("X-Powered-By", ' 3.2.1')
  response.setHeader("Content-Type", "application/json;charset=utf-8");
}

function md5(data) {
  const hash = crypto.createHash('md5');
  return hash.update(data).digest('hex');
}

function methodCheck(req, res, method) {
  /**
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {string} method request method that you nedd
   */
  if (req.method !== method) {
    res.writeHead(405, {"Content-Type": "text/plain"});
    res.end("405 error! Method Not Allowed!");
    return false;
  }
  return true;
}

function authentication(req) {
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
   * @param {Object} req http request object
   * 
   * return promise param
   * @param {Object} auth promise then param
   * @param {string} auth.desc descript result
   * @param {boolean} auth.result return result pass or not
   * @param {Object} auth.data return query sql data
   */
  const cookies = req.headers.cookie.split(';');
  let userCookie = '';
  for (let i = 0; i < cookies.length; i++) {
    const KV = cookies[i].replace(' ','').split('=');
    if (KV[0] == 'toolsite') {
      userCookie = KV[1];
      break;
    }
  }
  return new Promise((resolve, reject) => {
    selectData('member', ['account', 'session', 'power'], `session='${userCookie}'`)
    .then(data => {
      if (data.result.length != 1) {
        resolve({
          desc: 'user session not found',
          result: false,
          data: data.result
        });
        return;
      };
      resolve({
        desc: 'user is member',
        result: true,
        data: data.result[0]
      })
    }, err => {
      console.error('authentication select data fail');
      console.error(err);
    })
  })
}

module.exports = { CORS, methodCheck, md5, validator, authentication }