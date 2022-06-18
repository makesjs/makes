import fs from 'fs';
import os from 'os';
import path from 'path';

process.addListener('exit', cleanup);

const temps = [];

export function cleanup() {
  for (const tmp of temps) {
    if (tmp.deleted) continue;
    try {
      fs.rmdirSync(tmp.folder, { recursive: true });
      tmp.deleted = true;
    } catch (e) {
      // ignore
      console.warn(e);
    }
  }
}

export default function () {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'makes-'));
  temps.push({folder: dir, deleted: false});
  return dir;
}
