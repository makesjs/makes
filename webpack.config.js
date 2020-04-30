const path = require('path');

module.exports = {
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  entry: './lib/index.js',
  mode: 'production'
};
