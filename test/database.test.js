const { init, connectDatabase, createDatabase, selectDatabase, existTable, createTable, insertData, selectData, sqlCustom } = require('../src/util/database');


const testMethod = {
  existTable: function () {
    existTable('FONT_CACHE').then((data) => {
      const { have, result, fields } = data;
      console.log(have);
    }, (err) => {
      throw err;
      // createTable('FONT_CACHE',['id SMALLINT', 'name VARCHAR(255)', 'cachePath VARCHAR(255)', 'sourceName VARCHAR(255)','sourcePath VARCHAR(255)']);
    })
  },
  insertData: function () {
    insertData('FONT_CACHE',['id','name','cachePath','sourceName','sourcePath'],[2,"'cc6f854f12ca61b026aa60a138dc6524'","'../src/fontCompress/cache/cc6f854f12ca61b026aa60a138dc6524.ttf'","'黑体.ttf'","'../src/fontCompress/font/黑体.ttf'"]);
  },
  seleData: function () {
    selectData('FONT_CACHE', ['id']).then(data => {
      console.log(data.result);
    }, err => {
      console.log(err);
    })
  }
}

selectData('FONT_CACHE', ['id'])
.then(data => {
  console.log('select result!');
  console.log(data.result);
  setTimeout(() => {
    insertData('FONT_CACHE',['id','name','cachePath','sourceName','sourcePath'],[2,"'cc6f854f12ca61b026aa60a138dc6524'","'../src/fontCompress/cache/cc6f854f12ca61b026aa60a138dc6524.ttf'","'黑体.ttf'","'../src/fontCompress/font/黑体.ttf'"])
    .then(data => {
      console.log('insert data result!')
      console.log(data.result);
    }, err => {
      console.error('insert data error!');
      console.error(err);
    })
  },2000);
  
},err => {
  console.error(err);
})