const test = require('ava');
const path = require('path');
const normalisedImport = require('../lib/normalised-import');

const example = 'example-imports';

test('normalised-import loads cjs from .cjs file', async t => {
  const loaded = await normalisedImport(path.join(__dirname, example, 'cjs-in-cjs', 'foo'));
  t.deepEqual(loaded.default, [ 1 ]);
});

test('normalised-import loads cjs from .js file', async t => {
  const loaded = await normalisedImport(path.join(__dirname, example, 'cjs-in-js', 'foo'));
  t.deepEqual(loaded.default, [ 1 ]);
  const loaded2 = await normalisedImport(path.join(__dirname, example, 'cjs-in-js', 'more'));
  t.deepEqual(loaded2.prepend, [ 2 ]);
  t.deepEqual(loaded2.append, { a: 3 });
});

test('normalised-import loads esm from .mjs file', async t => {
  const loaded = await normalisedImport(path.join(__dirname, example, 'esm-in-mjs', 'foo'));
  t.deepEqual(loaded.default, [ 1 ]);
});

test('normalised-import loads esm from .js file', async t => {
  const loaded = await normalisedImport(path.join(__dirname, example, 'esm-in-js', 'foo'));
  t.deepEqual(loaded.default, [ 1 ]);
  const loaded2 = await normalisedImport(path.join(__dirname, example, 'esm-in-js', 'more'));
  t.deepEqual(loaded2.prepend, [ 2 ]);
  t.deepEqual(loaded2.append, { a: 3 });
});

test('normalised-import silently return nothing when no file is found', async t => {
  const loaded = await normalisedImport(path.join(__dirname, example, 'nowhere', 'foo'));
  t.is(loaded, undefined);
});
