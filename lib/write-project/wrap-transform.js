const {Transform} = require('stream');

// A wrapper function for simple one-to-one or one-to-none transform
module.exports = function(transform) {
  return new Transform({
    objectMode: true,
    transform: (file, enc, cb) => {
      if (file.isBuffer()) {
        try {
          file = transform(file);
        } catch (e) {
          e.message = `Error in skeleton file: ${file.path}\n${e.message}`;
          cb(e);
          return;
        }
      }
      cb(null, file);
    }
  });
};
