const mysql = require('mysql');
const config = require('../config');

let connection = mysql.createConnection(config.mysql);

function sqlCustom(task) {
  // 自定义sql 命令
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(task, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({result, fields});
    })
  })
}

function updateData(table, set, condition) {
  /**
   * @param {string} table database table name
   * @param {array} set database set condition
   * @param {string} condition database WHERE condition
   */
  return new Promise((resolve, reject) => {
    const task = `UPDATE ${table} SET ${set.join(', ')} WHERE ${condition}`;
    connection.query(task, (err, result, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({result, fields});
    })
  })
}

function selectData(table, column, condition) {
  /**
   * @param {string} table database table name
   * @param {Array=} column table column names
   * @param {string} condition select data condition
   */
  // connection.connect();
  column = column ? column.join(', ') : "*";
  condition = condition ? ` WHERE ${condition}` : '';
  // 选择数据
  return new Promise((resolve, reject) => {
    const task = `SELECT ${column} FROM ${table+condition}`;
    connection.query(task, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({result, fields});
    })
  })
};

function deleteData(table, condition) {
  // 删除数据
  // connection.connect();
  condition = condition ? ' WHERE '+condition : '';
  return new Promise((resolve, reject) => {
    const task = `DELETE FROM ${table+condition}`;

    connection.query(task, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      resolve({result, fields});
    })
  })
};

function insertData(table, head, value)  {
  /* 
  table: string
  head: array
  value: array
   */
  // 插入数据
  // connection.connect();
  return new Promise((resolve, reject) => {
    const task = `INSERT INTO ${table} (${head.join(", ")}) VALUES (${value.join(", ")})`;
    connection.query(task, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      };
      resolve({ result, fields });
    });
  })
  
}

function createTable(table, column) {
  // 创建数据表
  // connection.connect();
  const colStr = column.join(", ");
  return new Promise((resolve, reject) => {
    const tarsk = `CREATE TABLE ${table} (${colStr})`;
    connection.query(tarsk, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      }
      console.log('create table success!');
      resolve({result, fields});
    })  
  });
  
}

function existTable(table) {
  /**
   * @param {string} table name of database table
   */
  // 判断是否存在表
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query("SHOW TABLES", (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      };
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
      resolve({have, result, fields});
    })
  })
  
}

function selectDatabase(database) {
  // 选择数据库
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(`use ${database}`, (err, results, fields) => {
      // connection.end();
      /* 
      {
        code: 'ER_BAD_DB_ERROR',
        errno: 1049, // error number
        sqlMessage: "Unknown database 'tools_system'",
        sqlState: '42000',
        index: 0,
        sql: 'use TOOLS_SYSTEM'
      }
      */
      if (err) {
        reject(err);
      };
      resolve({results, fields});
    })
  })
}

function createDatabase(database) {
  // 创建数据库
  // connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE ${database}`, (err, result, fields) => {
      // connection.end();
      if (err) {
        reject(err);
        return;
      };
      resolve({result, fields});
    })
  })
}

module.exports = { createDatabase, selectDatabase, existTable, createTable, insertData, selectData, sqlCustom, deleteData, updateData };