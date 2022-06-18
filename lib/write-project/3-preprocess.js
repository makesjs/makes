import isutf8 from 'isutf8';
import preprocess from '../preprocess/index.js';

const xmlExts = ['.html', '.htm', '.xml', '.svg'];

export default function(properties, features) {
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
}
