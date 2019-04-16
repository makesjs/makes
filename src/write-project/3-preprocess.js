import isutf8 from 'isutf8';
import preprocess from '../preprocess';

export default function(properties, features) {
  return function(file) {
    if (isutf8(file.contents)) {
      const ext = file.extname.toLowerCase();
      const htmlMode = ext === '.html' || ext === '.htm' || ext === '.xml';
      const contents = file.contents.toString();
      const newContents = preprocess(contents, properties, features, htmlMode ? 'html' : 'js');
      if (contents !== newContents) {
        file.contents = Buffer.from(newContents);
      }
    }
    return file;
  };
}
