const path = require("path"),
  comConfig = require("./webpack.common"),
  { server: serConfig } = require("../src/config");

const CSSLoader = {
  test: /\.css$/,
  use: [
    "vue-style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: true
      }
    }
  ]
};

comConfig.module.rules.push(CSSLoader);
comConfig.devtool = "inline-source-map";
comConfig.devServer.proxy = {
  "/": `http://${serConfig.host}${
    serConfig.httpPort == 80 ? "" : ":" + serConfig.httpPort
  }`
};

module.exports = comConfig;
