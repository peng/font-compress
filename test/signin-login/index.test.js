const { authUser, chgPassword } = require("../../src/signIn-logIn/index");
// authUser({
//   name: "peng",
//   password: "123456"
// });
chgPassword({
  name: "peng",
  newPassword: "123456love"
});
