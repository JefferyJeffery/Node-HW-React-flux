const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 讓你可以動態插入 bundle 好的 .js 檔到 .index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
      hash: 1,
  template: `${__dirname}/src/index.html`,
  filename: 'index.html',
  inject: 'body',
});

// plugin
var _plugins = [];
_plugins.push(HTMLWebpackPluginConfig);
_plugins.push(
  new ExtractTextPlugin(2, "vendors-[hash].css"),
  new ExtractTextPlugin(1, "styles-[hash].css")
);
_plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash].js'
  })
);

// entry 為進入點，output 為進行完 eslint、babel loader 轉譯後的檔案位置
module.exports = {
  entry:{
    app: [
      //'webpack/hot/dev-server',
      path.resolve(__dirname, 'src/index.js')
    ],
    vendor:[
      "react",
      "react-router"
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: `${__dirname}/src`,
        exclude: /bundle\.js$/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
          test: /\.styl$/,
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer!stylus'),
          id:1
      },
      {
          test: /\.css$/,
          loader: 'style!css',
          id:2
      }
    ],
  },
  // 啟動開發測試用 server 設定（不能用在 production）
  devServer: {
    inline: true,
    port: 8008,
  },
  plugins: _plugins,
};
