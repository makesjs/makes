const path = require('path');

// Normalise possible mjs/cjs/js file import.
module.exports = async function(modulePath) {
  // Use Absolute specifiers
  // https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#import-specifiers
  const p = 'file://' + path.resolve(modulePath);

  // 1. try path.mjs first
  try {
    return await import(p + '.mjs');
  } catch (e) {
    // ignore
    // console.error(e);
  }

  // 2. try path.cjs
  try {
    // Note we use import() to load commonjs code,
    // it automatically provides module.exports in
    // default export.
    return await import(p + '.cjs');
  } catch (e) {
    // ignore
    // console.error(e);
  }

  // 3. try path.js, this will respect the "type": "module"
  // if it presents in skeleton's package.json
  try {
    // Note we use import() to load commonjs code,
    // it automatically provides module.exports in
    // default export.
    return await import(p + '.js');
  } catch (e) {
    // ignore
    // console.error(e);
  }
};
