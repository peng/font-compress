const path = require('path');
const VueLoader = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

config = {
  mode:'development',
  entry:"./src/page/js/index.js",
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:"static/js/[name].[hash].js",
    publicPath:'/'
  },
  module:{
    rules:[
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                "component",
                {
                  "libraryName": "element-ui",
                  "styleLibraryName": "theme-chalk"
                }
              ]
            ]
          }
        }
      },
      {
        test:/\.(gif|png|jpe?g|svg)$/i,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit:2000,
              name:'[name].[hash].[ext]',
              outputPath:'static/images/'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test:/.vue$/,
        loader: 'vue-loader'
      },
      {
        test:/\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins:[
    new VueLoader(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `${path.resolve(__dirname,'../src/page/index.html')}`
    })
  ],
  devServer:{
    contentBase:path.join(__dirname),
    compress: true,
    port:3000,
    host:'0.0.0.0',
    disableHostCheck:true
  },
  performance:{
    maxAssetSize:99999999
  }
}

module.exports = config;