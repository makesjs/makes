// Normalise possible mjs/cjs/js file import.
module.exports = async function(path) {
  // 1. try path.mjs first
  try {
    return await import(path + '.mjs');
  } catch (e) {
    // ignore
    // console.error(e);
  }

  // 2. try path.cjs
  try {
    // Note we use import() to load commonjs code,
    // it automatically provides module.exports in
    // default export.
    return await import(path + '.cjs');
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
    return await import(path + '.js');
  } catch (e) {
    // ignore
    // console.error(e);
  }
};
