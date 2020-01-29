// const mysql = require("mysql");
import mysql from "mysql";
jest.mock("mysql");
(<jest.Mock>mysql.createConnection).mockReturnValue({
  query: (sql: string, cb: Function) => {
    let err, result, fields;

    switch (sql) {
      case "CREATE DATABASE mytest":
        err = null;
        result = {};
        // fields = undefined
        break;
      case "CREATE DATABASE mytesterr":
        err = {};
        // result = undefined
        // fields = undefined
        break;
      case "use mytest":
        err = null;
        result = {};
        break;
      case "use mytesterr":
        err = {};
        break;
      case "SHOW TABLES":
        err = null;
        result = [
          { Tables_in_tools_system: "FONT_CACHE" },
          { Tables_in_tools_system: "test_table" },
          { Tables_in_tools_system: "font" },
          { Tables_in_tools_system: "member" }
        ];
        fields = [];
        break;
      case "CREATE TABLE test_table (id SMALLINT, account VARCHAR(255))":
        err = null;
        result = {};
        break;
      case "CREATE TABLE test_table (id SMALLINT, account VARCHAR(255), err)":
        err = {};
        break;
      case "INSERT INTO test_table (id, account) VALUES (0, hahaha)":
        err = {};
        break;
      case "INSERT INTO test_table (id, account) VALUES (0, 'hahaha')":
        err = null;
        result = {};
        break;
      case "DELETE FROM test_table WHERE id=2":
        err = null;
        result = {};
        break;
      case "DELETE FROM test_tableerr":
        err = {};
        break;
      case "SELECT id FROM test_table WHERE id=7":
        err = null;
        result = {};
        break;
      case "SELECT id FROM test_table WHERE id=7err":
        err = {};
        break;
      case "UPDATE test_table SET id=22, account='hahahaha' WHERE id=4":
        err = null;
        result = {};
        break;
      case "UPDATE test_table SET id=22, account='hahahaha' WHERE id=4err":
        err = {};
        break;
    }

    cb && cb(err, result, fields);
  }
});
import {
  createDatabase,
  selectDatabase,
  existTable,
  createTable,
  insertData,
  selectData,
  sqlCustom,
  deleteData,
  updateData
} from "../../src/util/database.js";
/* 在mock后引入createDatabase，在前引入文件内部的导出模块会出现无法找到文件内部connection 问题 ？？？ 什么原因呢，应该需要看到jest源码才能解决 */

test("create database method test", () => {
  createDatabase("mytest").then(
    (res: any) => {},
    err => {
      expect(err).toEqual({});
    }
  );

  createDatabase("mytesterr").then(
    res => {
      expect(res).toEqual({
        result: {},
        fields: undefined
      });
    },
    err => {}
  );
});

test("select database method", () => {
  selectDatabase("mytest").then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );

  selectDatabase("mytesterr").then(
    res => {
      expect(res).toEqual({
        result: {},
        fields: undefined
      });
    },
    err => {}
  );
});

test("exist table method", () => {
  existTable("test_table").then(res => {
    expect(res.have).toBeTruthy();
  });
});

test("create database table", () => {
  // success test
  createTable("test_table", ["id SMALLINT", "account VARCHAR(255)"]).then(
    res => {
      expect(res.result).toEqual({});
    },
    err => {}
  );
  // fail test
  createTable("test_table", [
    "id SMALLINT",
    "account VARCHAR(255)",
    "err"
  ]).then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );
});

test("insert data method", () => {
  insertData("test_table", ["id", "account"], [0, "'hahaha'"]).then(res => {
    expect(res.result).toEqual({});
  });
  insertData("test_table", ["id", "account"], [0, "hahaha"]).then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );
});

test("delete data method", () => {
  deleteData("test_table", "id=2").then(
    res => {
      expect(res.result).toEqual({});
    },
    err => {}
  );
  deleteData("test_tableerr").then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );
});

test("select data method", () => {
  selectData("test_table", ["id"], "id=7").then(
    res => {
      expect(res.result).toEqual({});
    },
    err => {}
  );
  selectData("test_table", ["id"], "id=7err").then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );
});

test("update data method", () => {
  updateData("test_table", ["id=22", "account='hahahaha'"], "id=4").then(
    res => {
      expect(res.result).toEqual({});
    },
    err => {}
  );
  updateData("test_table", ["id=22", "account='hahahaha'"], "id=4err").then(
    res => {},
    err => {
      expect(err).toEqual({});
    }
  );
});
