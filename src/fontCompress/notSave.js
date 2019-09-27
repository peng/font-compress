/**
 * @file api compress font
 * compress font and not save on dist
 */

const 
  querystring = require('querystring'),
  Fontmin = require('fontmin'),
  { methodCheck } = require('../util'),
  path = require('path');

module.exports = function (req, res) {
  if (!methodCheck(req, res, 'GET')) return;

  const { font, type, words } = querystring.parse(req.url.split('?')[1]);
  const filePath = `${path.resolve(__dirname, './font')}/${font}.${type}`;
  console.log(querystring.parse(req.url.split('?')[1]));
  const fontmin = new Fontmin()
    .src(filePath)
    .use(Fontmin.glyph({
      text: words
    }))
    .run((err, files, stream) => {
      if (err) {
        console.error(err);
        res.end('error!');
        return;
      };
      console.log(stream);
      res.write(files[0].contents);
      res.end();
    })
}