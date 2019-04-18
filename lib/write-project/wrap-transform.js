const {Transform} = require('stream');

// A wrapper function for simple one-to-one or one-to-none transform
module.exports = function(transform) {
  return new Transform({
    objectMode: true,
    transform: (file, enc, cb) => {
      if (file.isBuffer()) {
        file = transform(file);
      }
      cb(null, file);
    }
  });
};
