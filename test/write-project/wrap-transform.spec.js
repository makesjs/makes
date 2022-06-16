const {test} = require('zora');
const wrap = require('../../lib/write-project/wrap-transform');
const Vinyl = require('vinyl');

test('transform touches file', async t => {
  return new Promise((resolve) => {
    const step = function(file) {
      file.touched = true;
      return file;
    };

    const ts = wrap(step);

    const file = new Vinyl({
      path: 'a.js',
      contents: Buffer.from('abc')
    });

    ts.once('data', file => {
      t.truthy(file.isBuffer());
      t.truthy(file.touched);
      t.is(file.contents.toString(), 'abc');
      resolve();
    });
    ts.write(file);
    ts.end();
  });
});

test('transform transforms file', async t => {
  return new Promise((resolve) => {
    const step = function(file) {
      const f = file.clone();
      f.contents = Buffer.from('#' + file.contents.toString());
      return f;
    };

    const ts = wrap(step);

    const file = new Vinyl({
      path: 'a.js',
      contents: Buffer.from('abc')
    });

    ts.once('data', file => {
      t.truthy(file.isBuffer());
      t.is(file.contents.toString(), '#abc');
      resolve();
    });
    ts.write(file);
    ts.end();
  });
});

test('transform skips file', async t => {
  return new Promise((resolve) => {
    const step = function(file) {
      if (file.toSkip) return;
      return file;
    };

    const ts = wrap(step);

    const file = new Vinyl({
      path: 'a.js',
      toSkip: true,
      contents: Buffer.from('abc')
    });

    ts.once('data', () => {
      t.fail('should not see a file');
      resolve();
    });
    ts.once('close', () => {
      t.ok(true, 'done without file');
      resolve();
    });
    ts.write(file);
    ts.end();
    setTimeout(() => {
      ts.destroy();
    }, 100);
  });
});

test('transform skips file not in buffer mode', async t => {
  return new Promise((resolve) => {
    const step = function(file) {
      file.touched = true;
      return file;
    };

    const ts = wrap(step);

    const file = new Vinyl({
      path: 'a.js',
      contents: null
    });

    ts.once('data', () => {
      t.falsy(file.isBuffer());
      t.falsy(file.touched);
      t.is(file.contents, null);
      resolve();
    });
    ts.write(file);
    ts.end();
  });
});

test('transform rethrows error', async t => {
  return new Promise((resolve) => {
    const step = function() {
      throw new Error('lorem');
    };

    const ts = wrap(step);

    const file = new Vinyl({
      path: 'a.js',
      contents: Buffer.from('abc')
    });

    ts.once('data', () => {
      t.fail('should not be here');
      resolve();
    });
    ts.on('error', error => {
      t.is(error.message, 'Error in skeleton file: a.js\nlorem');
      resolve();
    });

    ts.write(file);
    ts.end();
  });
});
