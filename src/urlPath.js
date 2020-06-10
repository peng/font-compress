const fontCompress = require("./fontCompress"),
  fontFile = require("./fontCompress/fontFile"),
  {
    signIn,
    logIn,
    signMember,
    updatePassword,
    memberList,
    updatePower,
    memberDel
  } = require("./signIn-logIn"),
  uploadFont = require("./fontCompress/uploadFont"),
  fontList = require("./fontCompress/fontList"),
  notSave = require("./fontCompress/notSave"),
  { fontDelete } = require("./fontCompress/fontDelete"),
  pageFiles = require("./pageFiles");

module.exports = {
  // 接口
  "/fontcompress": fontCompress, // 压缩字体接口
  notFound: (req, res) => {
    // 404
    res.writeHead(404, {
      "Content-Type": "text/plain"
    });
    res.end("404 error! not found!");
  },
  "/minifont": fontFile, // 获取压缩后字体接口
  "/signin": signIn, // 管理员注册接口
  "/login": logIn, // 登录接口
  "/signmember": signMember, // 添加组员接口
  "/uploadfont": uploadFont, // 上传文件接口
  "/fontlist": fontList, // 查询字体
  "/notsave": notSave, // 获取不储存压缩字体接口
  "/fontdelete": fontDelete, // 字体删除
  "/updatepassword": updatePassword, // 更改密码
  "/memberlist": memberList, // 获取成员列表接口
  "/updatepower": updatePower, // 更改权限接口
  "/memberdel": memberDel, // 删除成员接口
  "/page": pageFiles
};
