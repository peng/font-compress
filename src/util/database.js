const mysql = require("mysql");
const config = require("../config");

let connection = mysql.createConnection(config.mysql);

/**
 *
 * use sql syntax to do something
 *
 * @param {string} task
 */
function sqlCustom(task) {
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(task, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

/**
 * update table data
 *
 * @param {string} table database table name
 * @param {array} set database set condition
 * @param {string} condition database WHERE condition
 * @return {Promise} Promise
 */
function updateData(table, set, condition) {
  return new Promise((resolve, reject) => {
    const task = `UPDATE ${table} SET ${set.join(", ")} WHERE ${condition}`;
    connection.query(task, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success example
       *
       * err -> null
       * result -> Array [
       *   RowDataPacket { id: 7 }
       * ]
       * fields -> Array [
       *   FieldPacket {
       *     catalog: 'def',
       *     db: 'tools_system',
       *     table: 'test_table',
       *     orgTable: 'test_table',
       *     name: 'id',
       *     orgName: 'id',
       *     charsetNr: 63,
       *     length: 6,
       *     type: 2,
       *     flags: 0,
       *     decimals: 0,
       *     default: undefined,
       *     zeroFill: false,
       *     protocol41: true
       *   }
       * ]
       *
       * fail example
       *
       * err -> error Object {}
       * result -> undefined
       * fields -> undefined
       */
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

/**
 * select data
 *
 * @param {string} table database table name
 * @param {Array=} column table column names
 * @param {string=} condition select data condition
 * @return {Promise} Promise
 */
function selectData(table, column, condition) {
  // connection.connect();
  column = column ? column.join(", ") : "*";
  condition = condition ? ` WHERE ${condition}` : "";
  // 选择数据
  return new Promise((resolve, reject) => {
    const task = `SELECT ${column} FROM ${table + condition}`;
    connection.query(task, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success example
       *
       * err -> null
       * result -> Array [
       *   RowDataPacket { id: 7 }
       * ]
       * fields -> Array [
       *   FieldPacket {
       *     catalog: 'def',
       *     db: 'tools_system',
       *     table: 'test_table',
       *     orgTable: 'test_table',
       *     name: 'id',
       *     orgName: 'id',
       *     charsetNr: 63,
       *     length: 6,
       *     type: 2,
       *     flags: 0,
       *     decimals: 0,
       *     default: undefined,
       *     zeroFill: false,
       *     protocol41: true
       *   }
       * ]
       *
       * fail example
       *
       * err -> error Object {}
       * result -> undefined
       * fields -> undefined
       */
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

/**
 * delete data 删除数据
 *
 * @param {String} table table name
 * @param {String=} condition sql syntax WHERE condition it is chooose or not, if no condition will delete all table data
 * @return {Promise} Promise
 */
function deleteData(table, condition) {
  // connection.connect();
  condition = condition ? " WHERE " + condition : "";
  return new Promise((resolve, reject) => {
    const task = `DELETE FROM ${table + condition}`;

    connection.query(task, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success example
       *
       * err -> null
       * result -> OkPacket {
       *   fieldCount: 0,
       *   affectedRows: 0,
       *   insertId: 0,
       *   serverStatus: 34,
       *   warningCount: 0,
       *   message: '',
       *   protocol41: true,
       *   changedRows: 0
       * }
       * fields -> undefined
       *
       * fail example
       *
       * err -> error Object {}
       * result -> undefined
       * fields -> undefined
       */
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

/**
 * insert data into database 插入数据
 *
 * @param {String} table table name that you want to insert data
 * @param {Array} head table head name that you want to insert data
 * @param {Array} value value you want to insert match with head
 * @return {Promise} Promise
 *
 */
function insertData(table, head, value) {
  // connection.connect();
  return new Promise((resolve, reject) => {
    const task = `INSERT INTO ${table} (${head.join(
      ", "
    )}) VALUES (${value.join(", ")})`;
    connection.query(task, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success example
       *
       * err -> null
       * result -> OkPacket {
       *   fieldCount: 0,
       *   affectedRows: 0,
       *   insertId: 0,
       *   serverStatus: 2,
       *   warningCount: 0,
       *   message: '',
       *   protocol41: true,
       *   changedRows: 0
       * }
       * fields -> undefined
       *
       * fail example
       *
       * err -> error Object {
       *   code: 'ER_TABLE_EXISTS_ERROR',,
       *   errno: 1050,
       *   sqlMessage: "Table 'test_table' already exists",
       *   sqlState: '42S01',
       *   index: 0,
       *   sql: 'CREATE TABLE test_table (id SMALLINT, account VARCHAR(255))'
       * }
       * result -> undefined
       * fields -> undefined
       */

      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

/**
 * 创建数据表 create database table
 *
 * @param {String} table table name you want to create
 * @param {Array} column column name and data type
 * @return {Promise} Promise
 */
function createTable(table, column) {
  // connection.connect();
  const colStr = column.join(", ");
  return new Promise((resolve, reject) => {
    const tarsk = `CREATE TABLE ${table} (${colStr})`;
    connection.query(tarsk, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success example
       *
       * err -> null
       * result -> OkPacket {
       *   fieldCount: 0,
       *   affectedRows: 0,
       *   insertId: 0,
       *   serverStatus: 2,
       *   warningCount: 0,
       *   message: '',
       *   protocol41: true,
       *   changedRows: 0
       * }
       * fields -> undefined
       *
       * fail example
       *
       * err -> error Object {
       *   code: 'ER_TABLE_EXISTS_ERROR',,
       *   errno: 1050,
       *   sqlMessage: "Table 'test_table' already exists",
       *   sqlState: '42S01',
       *   index: 0,
       *   sql: 'CREATE TABLE test_table (id SMALLINT, account VARCHAR(255))'
       * }
       * result -> undefined
       * fields -> undefined
       */
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      console.log("create table success!");
      resolve({ result, fields });
    });
  });
}

/**
 * 判断是否存在表 exist table or not
 *
 * @param {string} table name of database table
 * @return {Promise} Promise
 */
function existTable(table) {
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query("SHOW TABLES", (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined|Array} result
       * @param {Object|undefined|Array} fields
       *
       * success example
       *
       * err -> null
       * result -> Array [
       *   RowDataPacket { Tables_in_tools_system: 'FONT_CACHE' },
       *   RowDataPacket { Tables_in_tools_system: 'test_table' },
       *   RowDataPacket { Tables_in_tools_system: 'font' },
       *   RowDataPacket { Tables_in_tools_system: 'member' }
       * ]
       * fields -> Array [
       *   FieldPacket {
       *     catalog: 'def',
       *     db: 'information_schema',
       *     table: 'TABLE_NAMES',
       *     orgTable: 'TABLE_NAMES',
       *     name: 'Tables_in_tools_system',
       *     orgName: 'TABLE_NAME',
       *     charsetNr: 33,
       *     length: 192,
       *     type: 253,
       *     flags: 1,
       *     decimals: 0,
       *     default: undefined,
       *     zeroFill: false,
       *     protocol41: true
       *   }
       * ]
       */
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      let have = false;
      for (let i = 0; i < result.length; i++) {
        const res = result[i];
        for (let item in res) {
          if (res[item] == table) {
            have = true;
            break;
          }
        }
      }
      resolve({ have, result, fields });
    });
  });
}

/**
 * 选择数据库 select database
 *
 * @param {string} database database name you want to select
 * @return {Promise} Promise
 */
function selectDatabase(database) {
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(`use ${database}`, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success status
       *
       * err -> null
       * result -> OkPacket {
       *   fieldCount: 0,
       *   affectedRows: 0,
       *   insertId: 0,
       *   serverStatus: 2,
       *   warningCount: 0,
       *   message: '',
       *   protocol41: true,
       *   changedRows: 0
       * }
       * fields -> undefined
       *
       * fail example with select a database that not exist
       *
       * err -> error Object {
       *   code: 'ER_BAD_DB_ERROR',
       *   errno: 1049,
       *   sqlMessage: "Unknown database 'mytestrrr'",
       *   sqlState: '42000',
       *   index: 0,
       *   sql: 'use mytestrrr'
       * }
       * result
       */

      /* console.log('error show');
      console.log(err);
      console.log('result show');
      console.log(result);
      console.log('fields show');
      console.log(fields); */
      // connection.end();

      if (err) {
        reject(err);
      }
      resolve({ result, fields });
    });
  });
}

/**
 * 创建数据库 create database method
 *
 * @param {string} database database name you want to create
 * @return {Promise} Promise
 */
function createDatabase(database) {
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE ${database}`, (err, result, fields) => {
      /**
       * @param {Object|null} err error message
       * @param {Object|undefined} result
       * @param {Object|undefined} fields
       *
       * success status
       *
       * err -> null
       * result -> OkPacket {
       *   fieldCount: 0,
       *   affectedRows: 1,
       *   insertId: 0,
       *   serverStatus: 2,
       *   warningCount: 0,
       *   message: '',
       *   protocol41: true,
       *   changedRows: 0
       * }
       * fields -> undefined
       *
       * fail example with create same name database
       *
       * err -> error object {
       *   code: 'ER_DB_CREATE_EXISTS',
       *   errno: 1007,
       *   sqlMessage: "Can't create database 'mytest'; database exists",
       *   sqlState: 'HY000',
       *   index: 0,
       *   sql: 'CREATE DATABASE mytest'
       * }
       * result -> undefined
       * fields -> undefined
       */
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({ result, fields });
    });
  });
}

module.exports = {
  createDatabase,
  selectDatabase,
  existTable,
  createTable,
  insertData,
  selectData,
  sqlCustom,
  deleteData,
  updateData
};
