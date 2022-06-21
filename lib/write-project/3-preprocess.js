const isutf8 = require('isutf8');
const preprocess = require('../preprocess');

const xmlExts = ['.html', '.htm', '.xml', '.svg'];

module.exports = function(properties, features) {
  return function(file) {
    if (isutf8(file.contents)) {
      const ext = file.extname.toLowerCase();
      const htmlMode = xmlExts.includes(ext);
      const contents = file.contents.toString();
      const newContents = preprocess(file.relative, contents, properties, features, htmlMode ? 'html' : 'js');
      if (contents !== newContents) {
        file.contents = Buffer.from(newContents);
      }
    }
    return file;
  };
};
