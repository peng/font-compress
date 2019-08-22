
const path = require('path');
const comConfig = require('./webpack.common');

const CSSLoader = {
  test: /\.css$/,
  use: [
    'vue-style-loader',
    {
      loader:'css-loader',
      options: {
        sourceMap: true
      }
    }
  ]
};

comConfig.module.rules.push(CSSLoader);
comConfig.devtool = 'inline-source-map';
comConfig.devServer.proxy = {
  '/': 'http://127.0.0.1:8000'
}

module.exports = comConfig;
