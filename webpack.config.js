var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var NodemonPlugin = require('nodemon-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var browserConfig = {
  entry: './src/browser/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        oneOf:[
          { test: /\.(js)$/, use: 'babel-loader' },
          { test: /\.scss$/, use: ['style-loader','css-loader','sass-loader']},
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    }),
    //new ExtractTextPlugin({filename:'', allChunks: true})
  ]
}

var serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        oneOf:[
          { test: /\.(js)$/, use: 'babel-loader' },
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    }),
    new NodemonPlugin(),
    //new ExtractTextPlugin({filename:'style.css', allChunks: true})
  ]
}

module.exports = [browserConfig, serverConfig]