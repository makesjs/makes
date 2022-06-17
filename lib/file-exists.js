import fs from 'fs';

export function fileExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

export function folderExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}
