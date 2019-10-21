const path = require("path"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  ImageminPlugin = require("imagemin-webpack-plugin").default,
  ImageMinMozJpeg = require("imagemin-mozjpeg"),
  comConfig = require("./webpack.common"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  pubPath = require("../src/config").pageProdPath,
  fse = require("fs-extra");

comConfig.mode = "production";
comConfig.output.publicPath = pubPath;

const distPath = path.resolve(__dirname, "../");
comConfig.output.path = distPath + "/dist/page";
const CleanPlugin = new CleanWebpackPlugin();
comConfig.plugins.push(CleanPlugin);

const MiniCSSPlugin = new MiniCssExtractPlugin({
  filename: "static/css/[name].[hash].css",
  chunkFilename: "static/css/[name].[hash].css"
});

const CSSLoader = {
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        config: {
          path: "./config/postcss.config/js"
        }
      }
    }
  ]
};

const Imagemin = new ImageminPlugin({
  test: /\.(jpe?g|png|gif)$/i,
  gifsicle: {
    optimizationLevel: 1
  },
  jpegtran: null,
  pngquant: {
    quality: "50-70" //png 图片质量调整 1~100
  },
  plugins: [
    ImageMinMozJpeg({
      quality: 70 //jpg 图片质量调整，（默认的压缩不行）
    })
  ]
});
// 暂时支持JPG png 图片压缩较好

config.module.rules.push(CSSLoader);
config.plugins.push(MiniCSSPlugin);
config.plugins.push(Imagemin); //将此行注释掉不会压缩图片
config.plugins.push(new OptimizeCSSAssetsPlugin({}));
config.output.publicPath = pubPath;

config.plugins.push({
  apply: compiler => {
    fse.copy(
      path.resolve(__dirname, "../src"),
      path.resolve(__dirname, "../dist"),
      {
        filter: function(src, dest) {
          // console.log(src);
          // console.log(dest);
          return !/page\//.test(src);
        }
      },
      err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("copy server files successful!");
      }
    );
  }
});

module.exports = comConfig;
