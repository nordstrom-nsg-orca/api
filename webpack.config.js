const sls = require('serverless-webpack');
const path = require('path');

module.exports = {
  entry: sls.lib.entries,
  target: 'node',
  mode: 'development',
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    libraryTarget: 'commonjs'
  }
};
