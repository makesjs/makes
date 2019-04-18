const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const {error} = require('../log');

// a mini implementation of vinyl-fs.desc
module.exports = function(dir) {
  return through2.obj((file, enc, cb) => {
    if (file.isBuffer()) {
      const fpath = path.join(dir, file.relative);

      // writePolicy=skip is handled by ./when-file-exists.js
      const flag = file.writePolicy === 'append' ? 'a' : 'w';

      try {
        ensureDir(path.dirname(fpath));
        fs.writeFileSync(fpath, file.contents, {flag});
      } catch (e) {
        error(`Failed to write ${file.relative}\n${e.message}`);
      }
    }
    cb();
  });
};

function ensureDir(dir) {
  if (needToCreateDir(dir)) {
    ensureDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

function needToCreateDir(path) {
  let stats;
  try {
    stats = fs.statSync(path);
  } catch (e) {
    return true;
  }
  if (stats.isDirectory()) {
    return false;
  }
  throw new Error(`Cannot create directory ${path}`);
}
