import { pathToFileURL } from 'url';

// Bypass webpack rewrite dynamic import.
const _import = new Function('p', 'return import(p)');

// Normalise possible mjs/cjs/js file import.
export default async function(modulePath) {
  // Use Absolute specifiers
  // https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#import-specifiers
  const p = pathToFileURL(modulePath);
  // Note p is URL object, p + '.mjs' auto converts p into a string.

  // 1. try path.mjs first
  try {
    return await _import(p + '.mjs');
  } catch (e) {
    // ignore
    // console.error(e);
  }

  // 2. try path.cjs
  try {
    // Note we use import() to load commonjs code,
    // it automatically provides module.exports in
    // default export.
    return await _import(p + '.cjs');
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
    return await _import(p + '.js');
  } catch (e) {
    // ignore
    // console.error(e);
  }
}
