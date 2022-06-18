import fs from 'fs';
import os from 'os';
import path from 'path';

process.addListener('exit', cleanup);

const tmpDirs = [];

export function cleanup() {
  for (const dir of tmpDirs) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

export default function () {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'makes-'));
  tmpDirs.push(dir);
  return dir;
}
