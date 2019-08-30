const fontCompress = require('./fontCompress');
const fontFile = require('./fontCompress/fontFile');
const { signIn, logIn, signMember } = require('./signIn-logIn');
const uploadFont = require('./fontCompress/uploadFont');
const fontList = require('./fontCompress/fontList');

module.exports = {
  // 接口
  '/fontcompress': fontCompress, // 压缩字体接口
  'notFound': (req, res) => {
    // 404
    res.writeHead(404, {
      "Content-Type": "text/plain"
    });
    res.end("404 error! not found!");
  },
  '/minifont': fontFile, // 获取压缩后字体接口
  '/signin': signIn, // 管理员注册接口
  '/login': logIn,  // 登录接口
  '/signmember': signMember, // 添加组员接口
  '/uploadfont': uploadFont, // 上传文件接口
  '/fontlist': fontList
}