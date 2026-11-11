const fs = require('fs');
const os = require('os');
const path = require('path');

process.addListener('exit', cleanup);

const temps = [];
const nodeMajorVersion = Number(process.versions.node.split('.')[0]);

function cleanup() {
  for (const tmp of temps) {
    if (tmp.deleted) continue;
    
    try {
      if (nodeMajorVersion >= 26) {
        fs.rmSync(tmp.folder, { recursive: true, force: true });
      } else {
        fs.rmdirSync(tmp.folder, { recursive: true });
      }

      tmp.deleted = true;
    } catch (e) {
      // ignore
      console.warn(e);
    }
  }
}

function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'makes-'));
  temps.push({folder: dir, deleted: false});
  return dir;
}

tmpDir.cleanup = cleanup;
module.exports = tmpDir;
