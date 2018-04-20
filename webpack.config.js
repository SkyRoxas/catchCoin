// const path = require('path')
// const webpack = require('webpack')

module.exports = {
  entry: './src/app/entry.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
