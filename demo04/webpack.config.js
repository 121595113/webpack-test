const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const helpers = require('../helpers');
const isWebpackDevServer = helpers.isWebpackDevServer();
const emptyFunction = () => {};

const cssLoader = ['style-loader', {
  loader: 'css-loader',
  options: {
    sourceMap: true,
  }
}];

module.exports = {
  entry: {
    // common: ['common'],
    main: './src/js/main.js',
    main2: './src/js/main2.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: isWebpackDevServer ? '/' : './',
    filename: 'js/[name].js'
  },
  devtool: isWebpackDevServer ? '#cheap-module-eval-source-map' : 'none',
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }
    }, {
      test: /\.css$/,
      use: isWebpackDevServer ? [...cssLoader] : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        publicPath: '../',
        use: 'css-loader'
      })
    }, {
      test: /\.scss$/,
      use: isWebpackDevServer ? [...cssLoader, 'sass-loader'] : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        publicPath: '../',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.(png|jpg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name]-[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    isWebpackDevServer ? emptyFunction : new ExtractTextPlugin({
      filename: 'css/[name].bundle.css?v=[contenthash:8]'
    }),
    new UglifyJsPlugin({
      sourceMap: isWebpackDevServer ? true : false,
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/common.js',
    }),
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'index.html',
      template: 'src/index.html',
      hash: true,
      // minify: { //压缩HTML文件
      //   removeComments: true, //移除HTML中的注释
      //   collapseWhitespace: true, //删除空白符与换行符，
      //   minifyCSS: true, //压缩style标签和style属性中的样式
      //   minifyJS: true //压缩script标签和事件属性中的样式
      // },
      chunks: ['common', 'main']
    }),
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'main2.html',
      template: 'src/index.html',
      hash: true,
      chunks: ['common', 'main3']
    }),
  ],
  devServer: {
    contentBase: [path.join(__dirname, '../')],
    port: 8080,
    // host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    proxy: {
      // '/api/v1': {
      //   target: 'http://192.168.1.81:4500/',
      //   changeOrigin: true
      // }
    }
  },
};