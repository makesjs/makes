import fs from 'fs';
import path from 'path';
import {Transform} from 'stream';
import {error} from '../log.js';

// a mini implementation of vinyl-fs.desc
export default function(dir) {
  return new Transform({
    objectMode: true,
    transform: (file, enc, cb) => {
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
    }
  });
}

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
  // stats exists, but it's not a directory.
  throw new Error(`Cannot create directory ${path}`);
}
