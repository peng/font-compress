const { createTable } = require("./util/database");

createTable("member", [
  "id SMALLINT",
  "account VARCHAR(255)",
  "password VARCHAR(255)",
  "nickname VARCHAR(255)",
  "headimg VARCHAR(255)",
  "session VARCHAR(255)",
  "power VARCHAR(255)"
]).then(
  data => {
    console.log("create member success");
  },
  err => {
    console.error(err);
    console.error("create member fail");
  }
);

createTable("FONT_CACHE", [
  "id SMALLINT",
  "name VARCHAR(255)",
  "cachePath VARCHAR(255)",
  "sourceName VARCHAR(255)",
  "sourcePath VARCHAR(255)"
]).then(
  data => {
    console.log("create FONT_CACHE fail");
  },
  err => {
    console.error(err);
    console.error("create FONT_CACHE fail");
  }
);

createTable("font", [
  "id SMALLINT",
  "name VARCHAR(255)",
  "type VARCHAR(255)",
  "path VARCHAR(255)"
]).then(
  data => {
    console.log("create font success");
  },
  err => {
    console.log(err);
    console.log("create font fail");
  }
);
