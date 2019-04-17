import test from 'ava';
import wrap from '../../lib/write-project/wrap-transform';
import Vinyl from 'vinyl';

test.cb('transform touches file', t => {
  const step = function(file) {
    file.touched = true;
    return file;
  };

  const ts = wrap(step);

  const file = new Vinyl({
    path: 'a.js',
    contents: Buffer.from('abc')
  });

  ts.write(file);
  ts.end();
  ts.once('data', file => {
    t.truthy(file.isBuffer());
    t.truthy(file.touched);
    t.is(file.contents.toString(), 'abc');
    t.end();
  });
});

test.cb('transform transforms file', t => {
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

  ts.write(file);
  ts.end();
  ts.once('data', file => {
    t.truthy(file.isBuffer());
    t.is(file.contents.toString(), '#abc');
    t.end();
  });
});

test.cb('transform skips file', t => {
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

  ts.write(file);
  ts.end();
  setTimeout(() => {
    ts.destroy();
  }, 100);
  ts.once('data', () => {
    t.fail('should not see a file');
    t.end();
  });
  ts.once('close', () => {
    t.pass('done without file');
    t.end();
  });
});

test.cb('transform skips file not in buffer mode', t => {
  const step = function(file) {
    file.touched = true;
    return file;
  };

  const ts = wrap(step);

  const file = new Vinyl({
    path: 'a.js',
    contents: null
  });

  ts.write(file);
  ts.end();
  ts.once('data', () => {
    t.falsy(file.isBuffer());
    t.falsy(file.touched);
    t.is(file.contents, null);
    t.end();
  });
});