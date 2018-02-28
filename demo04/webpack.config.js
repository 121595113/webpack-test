const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const helpers = require('../helpers');
const isWebpackDevServer = helpers.isWebpackDevServer();
const emptyFunction = () => {};
const ytWebpackContentReplacePlugin = require('yt-webpack-content-replace-plugin');

const cssLoader = ['style-loader', {
  loader: 'css-loader',
  options: {
    sourceMap: true,
  }
}];

// entry
const filesEntry = glob.sync('src/**/!(_)*.js');
let entrysObj = {};
filesEntry.forEach(filePath => {
  entrysObj[path.parse(filePath).name] = `./${filePath}`;
});

// htmlwebpackPlugins
const filesHtml = glob.sync('src/**/!(_)*.{html,htm}');
let htmlPlugins = [];
filesHtml.forEach(filePath => {
  let pathObj = path.parse(filePath);
  let dir = pathObj.dir.split('/').slice(1).join('/');

  htmlPlugins.push(new HtmlwebpackPlugin({
    title: 'Webpack-demos',
    filename: `${dir ? dir + '/': ''}${pathObj.base}`,
    template: filePath,
    hash: true,
    // minify: { //压缩HTML文件
    //   removeComments: true, //移除HTML中的注释
    //   collapseWhitespace: true, //删除空白符与换行符，
    //   minifyCSS: true, //压缩style标签和style属性中的样式
    //   minifyJS: true //压缩script标签和事件属性中的样式
    // },
    chunks: entrysObj[pathObj.name] ? ['common', pathObj.name] : []
  }));
});

module.exports = {
  entry: Object.assign({
    // common: ['common'],
  }, entrysObj),
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
    ...htmlPlugins,
    // new HtmlwebpackPlugin({
    //   title: 'Webpack-demos',
    //   filename: 'index.html',
    //   template: 'src/index.html',
    //   hash: true,
    //   // minify: { //压缩HTML文件
    //   //   removeComments: true, //移除HTML中的注释
    //   //   collapseWhitespace: true, //删除空白符与换行符，
    //   //   minifyCSS: true, //压缩style标签和style属性中的样式
    //   //   minifyJS: true //压缩script标签和事件属性中的样式
    //   // },
    //   chunks: ['common', 'main']
    // }),
    isWebpackDevServer ? emptyFunction : new ytWebpackContentReplacePlugin({
      rules: [{
        test: /(src=['"])\.\/js/g,
        use: '$1../js'
      }],
      exts: ['html'],
      includes: ['page'],
      path: path.resolve(__dirname, './dist')
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