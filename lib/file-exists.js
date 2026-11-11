const fs = require('fs');

exports.fileExists = function (path) {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch {
    return false;
  }
};

exports.folderExists = function (path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
};
