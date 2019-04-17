const applicable = require('../applicable');
const path = require('path');
const FILTERED_FILE = /^(.+)__if_(.+)$/;

// filter by features on some-file.ext__if_sass_or_less
// support nested condition on every folder level
// src__if_webpack/boot__if_something/app.ts__if_typescript
module.exports = function(features) {
  return function(file) {
    const parts = file.relative.split(/\\|\//);
    const cleanParts = [];
    let filtered = false;

    for (let i = 0, ii = parts.length; i < ii; i++) {
      const part = parts[i];
      const match = part.match(FILTERED_FILE);

      if (match) {
        filtered = true;
        const cleanPart = match[1];
        const condition = match[2];

        if (applicable(features, condition)) {
          // Remove __if_x from the part.
          cleanParts.push(cleanPart);
        } else {
          // Not applicable, skip this file
          return;
        }
      } else {
        cleanParts.push(part);
      }
    }

    if (filtered) {
      file.path = path.join(file.base, ...cleanParts);
    }

    return file;
  };
};
