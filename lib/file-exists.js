const fs = require('fs');

module.exports = function(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
};
