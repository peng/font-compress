/**
 * @file compress font file, save on dist and database
 */

const querystring = require('querystring');
const Fontmin = require('fontmin');
const fs = require('fs');
const path = require('path');
const { insertData, selectData } = require('../util/database');
const { md5, methodCheck } = require('../util');
const { url } = require('../config');

/**
 * 
 * compress font
 * 
 * @param {Object} res http response param
 * @param {string} font font name in library
 * @param {string} text text text that you want to show special font
 * @param {string} extension font extension name
 */
function compress(res, font, text, extension = 'ttf') {

  const fileName = font + '.' +extension
  const filePath = path.resolve(__dirname, './font') + '/' + fileName;
  selectData('FONT_CACHE', ['name'])
  .then(data => {
    const cacheFileName = md5(text+font+extension) + "." + extension;
    const names = data.result;
    for (let i = 0; i < names.length; i++) {
      if (names[i].name == cacheFileName) {
        const endData = JSON.stringify({
          path: url + '/minifont/' + cacheFileName
        });
        res.write(endData);
        res.end();
        console.log('get repeat!');
        return;
      }
    }
    console.log(text);
    const fontmin = new Fontmin()
    .src(filePath)
    .use(Fontmin.glyph({
      text: text
    }))
    .run((err, files, stream) => {
      if (err) {
        console.error(err);
        res.end('some thing wrong!');
        return;
      };
      const cacheFile = `${path.resolve(__dirname, './cache')}/${cacheFileName}`;
      fs.writeFile(cacheFile, files[0].contents, err => {
        if (err) {
          console.error(err);
          res.end('some thing wrong!');
          return;
        }

        const newData = [];
        [names.length, cacheFileName, cacheFile, fileName, filePath].forEach(item => {
          if (typeof item == "string") {
            item = `'${item}'`;
          };
          newData.push(item);
        })
        insertData('FONT_CACHE',['id', 'name', 'cachePath', 'sourceName', 'sourcePath'], newData)
        .then(data => {
          const endData = querystring.stringify({
            path: 'http://127.0.0.1:8000/minifont/' + cacheFileName
          });
          res.write(endData);
          res.end();
        },err => {
          if (err) {
            console.error(err);
            res.end('some thing wrong!');
            return;
          }
        })


      })
    })
  })
  
}

module.exports = function (req, res) {
  /**
   * api param
   * @param {Object} options 
   * @param {string} options.font font name
   * @param {string} options.text text that you want to show special font
   * @param {string} options.extension font extension name
   * 
   */ 
  if (!methodCheck(req, res, 'POST')) return;

  let data = "";
  req
    .on('data', (chunk) => {
      data += chunk;
    })
    .on('end', () => {
      const { font, text, extension } = querystring.parse(data);
      compress(res, font, text, extension);
    });
  // res.end();

}