const {PassThrough} = require('stream');
const Vinyl = require('vinyl');
const fs = require('fs');
const path = require('path');

// a mini implementation of vinyl-fs.src, doesn't support glob.
module.exports = function(folders = []) {
  const rs = new PassThrough({objectMode: true});
  setImmediate(() => {
    folders.forEach(folder => {
      try {
        addFolder(folder, rs);
      } catch (e) {
        // ignore
      }
    });
    rs.end();
  });
  return rs;
};

// recursively push vinyl file to the readable stream
function addFolder(folder, rs, base = folder) {
  const files = fs.readdirSync(folder);

  files.forEach(file => {
    const fpath = path.join(folder, file);
    const stats = fs.statSync(fpath);

    if (stats.isFile()) {
      rs.write(new Vinyl({
        base,
        path: fpath,
        stat: stats,
        contents: fs.readFileSync(fpath)
      }));
    } else if (stats.isDirectory()) {
      addFolder(fpath, rs, base);
    }
  });
}
