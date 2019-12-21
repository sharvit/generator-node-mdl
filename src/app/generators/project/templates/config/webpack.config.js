const path = require('path');

const config = {
  mode: 'production',
  target: 'node',

  entry: path.resolve(__dirname, '../src/index.js'),

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    library: '<%= projectName %>',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

module.exports = config;
