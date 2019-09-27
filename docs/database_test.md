# database.js file methods test  
```
let connection = mysql.createConnection(config);

sql -> sql syntax

connection.query(sql, (err, result, fields) => {
  /**
    * @param {Object|null} err error message
    * @param {Object|undefined} result
    * @param {Object|undefined} fields
    */
})
```
1. create database
```javascript
connection.query("CREATE DATABASE myproject", (err, result, fields) => {
  /*
    success example  

    err -> null
    result -> OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0 
      }
    fields -> undefined

    fail example. Because of create same name database. 
          
    err -> error object
      { 
        Error: ER_DB_CREATE_EXISTS: Can't create database 'mytest'; database exists
        at Query.Sequence._packetToError (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
        at Query.ErrorPacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)
        at Protocol._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:291:23)
        at Parser._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:433:10)
        at Parser.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:43:10)
        at Protocol.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:38:16)
        at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:91:28)
        at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:525:10)
        at Socket.emit (events.js:188:13)
        at addChunk (_stream_readable.js:288:12)
        --------------------
        at Protocol._enqueue (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:144:48)
        at Connection.query (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:201:25)
        at Promise (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:178:16)
        at new Promise (<anonymous>)
        at createDatabase (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:177:10)
        at Object.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/test/util/basemethod.js:3:1)
        at Module._compile (internal/modules/cjs/loader.js:721:30)
        at Object.Module._extensions..js (internal/modules/cjs/loader.js:732:10)
        at Module.load (internal/modules/cjs/loader.js:620:32)
        at tryModuleLoad (internal/modules/cjs/loader.js:560:12)
        code: 'ER_DB_CREATE_EXISTS',
        errno: 1007,
        sqlMessage: "Can't create database 'mytest'; database exists",
        sqlState: 'HY000',
        index: 0,
        sql: 'CREATE DATABASE mytest' 
        }

    result -> undefined
    fields -> undefined

  */
})
```

2. selectDatabase  
```javascript
connection.query("use myproject", (err, result, fields) => {
  success example  

  err -> null
  result -> OkPacket {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
  }
  fields -> undefined

  fail example

  err -> error Object {
    Error: ER_BAD_DB_ERROR: Unknown database 'mytestrrr'
    at Query.Sequence._packetToError (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Query.ErrorPacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)
    at Protocol._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:91:28)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:525:10)
    at Socket.emit (events.js:188:13)
    at addChunk (_stream_readable.js:288:12)
    --------------------
    at Protocol._enqueue (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Connection.query (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:201:25)
    at Promise (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:157:16)
    at new Promise (<anonymous>)
    at selectDatabase (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:156:10)
    at Object.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/test/util/basemethod.js:4:1)
    at Module._compile (internal/modules/cjs/loader.js:721:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:732:10)
    at Module.load (internal/modules/cjs/loader.js:620:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:560:12),

    code: 'ER_BAD_DB_ERROR',
    errno: 1049,
    sqlMessage: "Unknown database 'mytestrrr'",
    sqlState: '42000',
    index: 0,
    sql: 'use mytestrrr'
  }
  result -> undefined
  fields -> undefined
})
```

3. createTable  

```javascript
connection.query("CREATE TABLE my_test (id SMALLINT, account VARCHAR(255))" (err, result, field) => {

  success example

  err -> null
  result -> OkPacket {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0 
  }
  fields -> undefined

  fail example

  err -> error Object {
    Error: ER_TABLE_EXISTS_ERROR: Table 'test_table' already exists
    at Query.Sequence._packetToError (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Query.ErrorPacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)
    at Protocol._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:91:28)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:525:10)
    at Socket.emit (events.js:188:13)
    at addChunk (_stream_readable.js:288:12)
    --------------------
    at Protocol._enqueue (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Connection.query (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:201:25)
    at Promise (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:108:16)
    at new Promise (<anonymous>)
    at createTable (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:106:10)
    at Object.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/test/util/basemethod.js:5:1)
    at Module._compile (internal/modules/cjs/loader.js:721:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:732:10)
    at Module.load (internal/modules/cjs/loader.js:620:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:560:12)

    code: 'ER_TABLE_EXISTS_ERROR',
    errno: 1050,
    sqlMessage: "Table 'test_table' already exists",
    sqlState: '42S01',
    index: 0,
    sql: 'CREATE TABLE test_table (id SMALLINT, account VARCHAR(255))'
  }
  result -> undefined
  fields -> undefined

})
```

4. existTable  
```javascript
connection.query("CREATE TABLE my_test (id SMALLINT, account VARCHAR(255))" (err, result, field) => {

  success example  

  err -> null
  result -> Array [
    RowDataPacket { Tables_in_tools_system: 'FONT_CACHE' },
    RowDataPacket { Tables_in_tools_system: 'font' },
    RowDataPacket { Tables_in_tools_system: 'member' },
    RowDataPacket { Tables_in_tools_system: 'test_table' }
  ]
  fields -> Array [
    FieldPacket {
      catalog: 'def',
      db: 'information_schema',
      table: 'TABLE_NAMES',
      orgTable: 'TABLE_NAMES',
      name: 'Tables_in_tools_system',
      orgName: 'TABLE_NAME',
      charsetNr: 33,
      length: 192,
      type: 253,
      flags: 1,
      decimals: 0,
      default: undefined,
      zeroFill: false,
      protocol41: true 
    }
  ]

  fail example  // 暂时不测试失败的


}
```

5. insertData  
```javascript
success example 

connection.query("INSERT INTO test_table (id, account) VALUES (0, hahaha)" (err, result, field) => {})

err -> null
result -> OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
fields -> undefined

fail example  

connection.query("INSERT INTO test_table (id, account) VALUES (0, hahaha)" (err, result, field) => {
  err -> error Object {
    Error: ER_BAD_FIELD_ERROR: Unknown column 'hahaha' in 'field list'
    at Query.Sequence._packetToError (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Query.ErrorPacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)
    at Protocol._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:91:28)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:525:10)
    at Socket.emit (events.js:188:13)
    at addChunk (_stream_readable.js:288:12)
    --------------------
    at Protocol._enqueue (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Connection.query (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:201:25)
    at Promise (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:98:16)
    at new Promise (<anonymous>)
    at insertData (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:96:10)
    at Object.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/test/util/basemethod.js:7:1)
    at Module._compile (internal/modules/cjs/loader.js:721:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:732:10)
    at Module.load (internal/modules/cjs/loader.js:620:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:560:12)
    code: 'ER_BAD_FIELD_ERROR',
    errno: 1054,
    sqlMessage: "Unknown column 'hahaha' in 'field list'",
    sqlState: '42S22',
    index: 0,
    sql: 'INSERT INTO test_table (id, account) VALUES (0, hahaha)' 
  }
  result -> undefined
  fields -> undefined
}

```

6. delete data  
```javascript

success example

connection.query("DELETE FROM test_table WHERE id=2", (err, result, field) => {})

err -> null
result OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 34,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0 
}
fields -> undefined

fail example

connection.query("DELETE FROM test_tableerr", (err, result, field) => {})

err -> {}
result -> undefined
fields -> indefined

```

7. select data  
```javascript
connection.query("SELECT id FROM test_table WHERE id=7", (err, result, field) => {})

success example
err -> null
result -> Array [
  RowDataPacket { id: 7 }
]
fields -> Array [
  FieldPacket {
    catalog: 'def',
    db: 'tools_system',
    table: 'test_table',
    orgTable: 'test_table',
    name: 'id',
    orgName: 'id',
    charsetNr: 63,
    length: 6,
    type: 2,
    flags: 0,
    decimals: 0,
    default: undefined,
    zeroFill: false,
    protocol41: true 
  }
]

connection.query("SELECT id FROM test_table WHERE id=7err", (err, result, field) => {})

fail example
err -> {}
result -> undefined
fields -> undefined
```

8. update data 
```javascript

success example

connection.query("UPDATE test_table SET id=22, account='hahahaha' WHERE id=4", (err, result, field) => {})
err -> null
result -> OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 34,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1 
}
fields -> undefined

fail example

connection.query("UPDATE test_table SET id=22, account='hahahaha' WHERE undefined", (err, result, field) => {})
err -> {
  Error: ER_BAD_FIELD_ERROR: Unknown column 'undefined' in 'where clause'
    at Query.Sequence._packetToError (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Query.ErrorPacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)
    at Protocol._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:91:28)
    at Socket.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:525:10)
    at Socket.emit (events.js:188:13)
    at addChunk (_stream_readable.js:288:12)
    --------------------
    at Protocol._enqueue (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Connection.query (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/node_modules/mysql/lib/Connection.js:201:25)
    at Promise (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:30:16)
    at new Promise (<anonymous>)
    at updateData (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/src/util/database.js:28:10)
    at Object.<anonymous> (/Users/zhangzhipeng/Desktop/Repository/GitHub/font-compress/test/util/basemethod.js:20:1)
    at Module._compile (internal/modules/cjs/loader.js:721:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:732:10)
    at Module.load (internal/modules/cjs/loader.js:620:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:560:12)
  code: 'ER_BAD_FIELD_ERROR',
  errno: 1054,
  sqlMessage: "Unknown column 'undefined' in 'where clause'",
  sqlState: '42S22',
  index: 0,
  sql: "UPDATE test_table SET id=22, account='hahahaha' WHERE undefined"
}
result -> undefined
fields -> undefined
```