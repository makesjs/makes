const fs = require('fs');
const os = require('os');
const path = require('path');

process.addListener('exit', cleanup);

const temps = [];

function cleanup() {
  for (const tmp of temps) {
    if (tmp.deleted) continue;
    try {
      // TODO after dropping nodejs v12 support,
      // move to rmSync with recursive and force instead.
      // rmdirSync is deprecated.
      fs.rmdirSync(tmp.folder, { recursive: true });
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
