import {test} from 'zora';
import url from 'url';
import normalisedImport from '../lib/normalised-import.js';

function p(relativePath) {
  return url.fileURLToPath(new URL(relativePath, import.meta.url));
}

test('normalised-import loads cjs from .cjs file', async t => {
  const loaded = await normalisedImport(p('./example-imports/cjs-in-cjs/foo'));
  t.deepEqual(loaded.default, [ 1 ]);
});

test('normalised-import loads cjs from .js file', async t => {
  const loaded = await normalisedImport(p('./example-imports/cjs-in-js/foo'));
  t.deepEqual(loaded.default, [ 1 ]);
  const loaded2 = await normalisedImport(p('./example-imports/cjs-in-js/more'));
  t.deepEqual(loaded2.prepend, [ 2 ]);
  t.deepEqual(loaded2.append, { a: 3 });
});

test('normalised-import loads esm from .mjs file', async t => {
  const loaded = await normalisedImport(p('./example-imports/esm-in-mjs/foo'));
  t.deepEqual(loaded.default, [ 1 ]);
});

test('normalised-import loads esm from .js file', async t => {
  const loaded = await normalisedImport(p('./example-imports/esm-in-js/foo'));
  t.deepEqual(loaded.default, [ 1 ]);
  const loaded2 = await normalisedImport(p('./example-imports/esm-in-js/more'));
  t.deepEqual(loaded2.prepend, [ 2 ]);
  t.deepEqual(loaded2.append, { a: 3 });
});

test('normalised-import silently return nothing when no file is found', async t => {
  const loaded = await normalisedImport(p('./example-imports/nowhere/foo'));
  t.is(loaded, undefined);
});
