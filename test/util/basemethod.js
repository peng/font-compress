const { createDatabase, selectDatabase, existTable, createTable, insertData, selectData, sqlCustom, deleteData, updateData } = require('../../src/util/database.js');

// createDatabase('mytest');
// selectDatabase('mytestrrr');
// createTable('test_table',['id SMALLINT','account VARCHAR(255)']);
// existTable('test_table');
/* for (let i = 0; i < 10; i++) {
  insertData('test_table',['id','account'], [i,"'gagaga'"]);
} */
// insertData('test_table',['id','account'], [1,"'gagaga'"]);
/* deleteData('test_table','id=2').then(res => {
  console.log(res);
}, err => {
  console.log(err);
}) */

/* selectData('test_table', ['id'], 'id=7').then(res => {
  console.log(res);
}) */
// updateData('test_table', ["id=22", "account='hahahaha'"], 'id=4').then(res =>{
//   console.log(res);
// },err => {
//   console.log(err);
// })
