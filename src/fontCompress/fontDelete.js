/**
 * @file delete font file and database font and FONT_CACHE to files change
 * method POST 
 * receive data format
 * {
 *   name: font name,
 *   type: font type
 * }
 */

const { selectData, deleteData } = require('../util/database'),
  { methodCheck, authentication } = require('../util/index'),
  fs = require('fs'),
  path = require('path');

/**
 * delete cache file and data in database method
 * 
 * @param {string} filename font file name
 * @return {Promise} Promise
 * @resolve {boolean} true means success, no false
 * @reject {Object} error object
 */
function deleteCache(filename) {
  return new Promise((resolve, reject) => {
    let deleteTask = {
      cacheDatabase: false,
      cacheFile: false
    };

    const checkFinish = () => {
      const { cacheFile, cacheDatabase } = deleteTask;
      if (cacheFile && cacheDatabase) {
        resolve(true)
      }
    }

    selectData('FONT_CACHE', ['cachePath'], `sourceName='${filename}'`).then(selRes => {

      // check if have cache
      if (selRes.result.length == 0) {
        resolve(true);
        return;
      }

      // delete cache database
      deleteData('FONT_CACHE', `sourceName='${filename}'`).then(() => {
        deleteTask.cacheDatabase = true;
        checkFinish();
      }, err => {
        reject(err);
      })

      // delete cache files
      let cacheNum = 0;
      selRes.result.forEach(item => {
        fs.unlink(item.cachePath, err => {
          if (err) {
            serverErr(err);
            return;
          }
          cacheNum++;
          if (cacheNum == selRes.length) {
            deleteTask.cacheFile = true;
            checkFinish();
          }
        })
      })
    }, err => {
      reject(err);
    })
  })
}

/**
 * @param {Object} req http request
 * @param {Object} res http response
 */
const fontDelete = (req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    // console.log(chunk.toString());
  });
  // console.log(data);
  req.on('end', () => {
    const filename = JSON.parse(data).name;

    if (!methodCheck(req, res, 'POST')) return;
    authentication(req, 'admin').then(power => {
      if (power.result) {
        let serverErrStatus = false;
        const deleteTask = {
          fontFile: false,
          fontDatabase: false,
          cache: false
        };
        const checkFinish = () => {
          const { fontFile, fontDatabase, cache } = deleteTask;
          if (fontFile && fontDatabase && cache) {
            res.end(JSON.parse({
              code: 200,
              desc: 'success'
            }));
          }
        }
        const serverErr = (err) => {
          if (serverErrStatus) return;
          serverErrStatus = true;
          console.error(err);
          res.end(JSON.stringify({
            code: 500,
            desc: 'some thing wrong'
          }));
        }

        // delete font file database
        deleteData('font', `name='${filename}'`).then(delRes => {
          deleteTask.fontDatabase = true;
          checkFinish();
        }, err => {
          serverErr(err)
        })

        // delete font file
        fs.unlink(path.resolve(__dirname, './font') + `/${filename}`, err => {
          if (err) {
            serverErr(err)
          }
          deleteTask.fontFile = true;
          checkFinish();
        })

        // delete cache
        deleteCache(filename).then(cacheStu => {
          deleteTask.cache = cacheStu;
          checkFinish();
        }, err => {
          serverErr(err);
        })

        
      } else {
        res.end(JSON.stringify({
          desc: 'forbidden',
          code: 403
        }))
      }
    }, err => {
      console.error(err);
      res.end(JSON.stringify({
        desc: 'some thing error',
        code: 500
      }))
    })
  })
  
  
  
}

module.exports = { fontDelete, deleteCache }