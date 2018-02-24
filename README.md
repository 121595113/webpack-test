## How to use

First, install [Webpack](https://www.npmjs.com/package/webpack) and [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) globally.

```bash
$ npm i -g webpack webpack-dev-server
```

Then, clone the repo.

```bash
$ git clone https://github.com/121595113/webpack-test.git
```

Install the dependencies.

```bash
$ cd webpack-test
$ npm install
```

Now, play with the source files under the repo's demo* directories.

```bash
$ cd demo04
$ npm run dev
```

If the above command doesn't open your browser automaticly, you have to visit http://127.0.0.1:8080 by yourself.

## Foreword: What is Webpack

Webpack is a front-end tool to build JavaScript module scripts for browsers.

It can be used similar to Browserify, and do much more.

```bash
$ browserify main.js > bundle.js
# be equivalent to
$ webpack main.js bundle.js
```

Webpack needs a configuration file called `webpack.config.js` which is just a CommonJS module.

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
```

After having `webpack.config.js`, you can invoke Webpack without any arguments.

```bash
$ webpack
```

Some command-line options you should know.

- `webpack` – building for development
- `webpack -p` – building for production (minification)
- `webpack --watch` – for continuous incremental building
- `webpack -d` – including source maps
- `webpack --colors` – making building output pretty

You could customize `scripts` field in your package.json file as following.

```javascript
// package.json
{
  // ...
  "scripts": {
    "dev": "webpack-dev-server --devtool eval --progress --colors",
    "deploy": "NODE_ENV=production webpack -p"
  },
  // ...
}
```
