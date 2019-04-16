import test from 'ava';
import filterByFeatures from '../../src/write-project/2-filter-by-features';
import Vinyl from 'vinyl';

const filter = filterByFeatures(['a', 'b']);

test('filterByFeatures bypass unaffected file', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.contents.toString(), 'abc');
});

test('filterByFeatures picks file meets condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__if_a',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.contents.toString(), 'abc');
});

test('filterByFeatures rejects file failed condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__if_c',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.falsy(newFile);
});

test('filterByFeatures picks folder meets condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/folder__if_b/file.any__if_a',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/folder/file.any');
  t.is(newFile.contents.toString(), 'abc');
});

test('filterByFeatures rejects folder failed condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/folder__if_c/file.any__if_a',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.falsy(newFile);
});

test('filterByFeatures picks deep folder meets condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/folder__if_b/f2/f3__if_a_and_b/file.any__if_a',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/folder/f2/f3/file.any');
  t.is(newFile.contents.toString(), 'abc');
});

test('filterByFeatures rejects deep folder failed condition', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/folder__if_b/f2/f3__if_c_and_b/file.any__if_a',
    contents: Buffer.from('abc')
  });
  const newFile = filter(file);
  t.falsy(newFile);
});
