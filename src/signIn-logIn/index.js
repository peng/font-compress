const querystring = require('querystring');
const { methodCheck, md5 } = require('../util');
const { existTable, selectData, createTable, insertData, updateData } = require('../util/database');

function addMember(res, account, password, power = "'member'") {
  /**
   * @param {Object} res http response
   * @param {string} account add member account, should add mark 'account' for sql
   * @param {string} password add member password, should add mark 'password' for sql
   * @param {string} power set member pwoer, should add mark 'password' for sql
   */
  selectData('member', ['id'])
  .then(data => {
    const id = data.result.length;
    insertData('member', ['id','account','password', 'power'], [id, account, password, power])
    .then(data => {

      res.write(JSON.stringify({
        code: 200,
        desc: 'success'
      }));
      res.end();
    },err => {
      console.error(err);
      res.end('insert member error!');
    })
  }, err => {
    console.error(err);
    res.end('seleData to get new id error!')
  })
}

function logIn(req, res) {
  /**
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
   */
  if (!methodCheck(req, res, 'POST')) return;
  let data = '';
  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      const { account, password } = JSON.parse(data);
      selectData('member', ['account', 'password'], `account='${account}'`)
      .then(data => {
        if (data.result.length == 0) {
          res.write(JSON.stringify({
            code: 401,
            desc: 'user is not found'
          }));
          res.end();
          return;
        };

        if (data.result[0].password !== password) {
          res.write(JSON.stringify({
            code: 401,
            desc: 'password is wrong'
          }))
          res.end();
          return;
        }
        
        const session  = md5(new Date().getTime().toString()+account);
        updateData('member', [`session='${session}'`], `account='${account}'`)
          .then(data => {
            const hour = 1;
            const expireTime = new Date(new Date().getTime() + hour * 60 * 60 * 1000).toGMTString();
            console.log(expireTime);
            // return;
            res.writeHead(200, {
              'Set-Cookie': `toolsite=${session}; Expires=${new Date(expireTime)}`
            });
            res.write(JSON.stringify({
              code: 200,
              desc: 'success'
            }));
            res.end();
          }, err => {
            console.error(err);
            res.end('login update data error!');
          })
        
      },err => {
        console.error(err);
        res.end('login select data error!');
      })
    })
};

function signMember(req, res) {
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
   */
  if (!methodCheck(req, res, 'POST')) return;

  let data = '';

  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      const { user, password } = querystring.parse(data);

      selectData('member', ['account'], `account='${user}'`)
        .then(data => {
          if (data.result.length == 0) {
            addMember(res, `'${user}'`, password);
            return;
          }

          res.write(JSON.stringify({
            code: 614,
            desc: 'user is exist'
          }));
          res.end();
        }, err => {
          console.error(err);
          res.end('sign member select data error!');
        })
    })
}

function signIn(req, res) {
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

  if (!methodCheck(req, res, 'POST')) return;

  let data = '';

  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      // console.log(querystring.parse(data));
      const { account, password } = JSON.parse(data); //querystring.parse(data);
      selectData('member')
        .then(data => {
          if (data.result.length == 0) {
            addMember(res, `'${account}'`, `'${password}'`, "'admin'");
          } else {
            res.write(JSON.stringify({
              code: 614,
              desc: 'admin is already exist'
            }))
            res.end();
          }
        },err => {
          console.error(err);
          res.write(JSON.stringify({
            code: 500,
            desc: 'add admin seleData fail'
          }))
          res.end();
        })
      /* existTable('member')
        .then(data => {
          if (data.have) {
            selectData('member')
            .then(data => {
              if (data.result.length == 0) {
                addMember(res, `'${account}'`, `'${password}'`, "'admin'");
              } else {
                res.write(JSON.stringify({
                  code: 614,
                  desc: 'admin is already exist'
                }))
                res.end();
              }
            },err => {
              console.error(err);
              res.write(JSON.stringify({
                code: 500,
                desc: 'add admin seleData fail'
              }))
              res.end();
            })
          } else {
            createTable('member', ['id SMALLINT', 'account VARCHAR(255)', 'password VARCHAR(255)', 'nickname VARCHAR(255)', 'headimg VARCHAR(255)', 'session VARCHAR(255)', 'power VARCHAR(255)'])
            .then(data => {
              addMember(res, account, password, "'admin'");
            }, err => {
              console.error(err);
              res.write(JSON.stringify({
                code: 500,
                desc: 'create table fail'
              }))
              res.end();
            })
          }
        }, err => {
          console.error(err);
          res.write(JSON.stringify({
            code: 500,
            desc: 'check exist table fail'
          }))
          res.end();
        }) */
    });

}

module.exports = { signIn, logIn, signMember };