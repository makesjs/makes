const through2 = require('through2');

// A wrapper function for simple one-to-one or one-to-none transform
module.exports = function(transform) {
  return through2.obj((file, enc, cb) => {
    if (file.isBuffer()) {
      file = transform(file);
    }
    cb(null, file);
  });
};
