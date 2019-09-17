const { methodCheck, authentication } = require('../util');
const { selectData }  = require('../util/database');

module.exports = function (req, res) {
  if (!methodCheck(req, res, 'GET')) return;

  authentication(req)
  .then(data => {
    if (data.result == false) {
      res.write(JSON.stringify({
        code: 403,
        desc: 'please login'
      }));
      res.end();
      return;
    };

    selectData('font', ['name', 'type'])
    .then(data => {
      const list = data.result;
      res.write(JSON.stringify({
        code: 200,
        data: list
      }));
      res.end();
    }, err => {
      console.error(err);
      res.write(JSON.stringify({
        code: 500,
        desc: 'select data fail'
      }));
      res.end();
    })
  });
}