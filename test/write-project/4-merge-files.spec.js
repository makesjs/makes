import {test} from 'zora';
import {once} from 'events';
import Vinyl from 'vinyl';
import mergeFiles from '../../lib/write-project/4-merge-files.js';

test('mergeFiles bypasses unique file', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));
  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/bar.ext',
      contents: Buffer.from('abc')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.ext');
  t.is(files[0].contents.toString(), 'abc');
});

test('mergeFiles by default use last file with same relative path', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));

  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/bar.ext',
      contents: Buffer.from('abc')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f1',
      path: '/f1/foo/bar.ext',
      contents: Buffer.from('cde')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f2',
      path: '/f2/foo/bar.ext',
      contents: Buffer.from('efg')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/f2/foo/bar.ext');
  t.is(files[0].contents.toString(), 'efg');
});

test('mergeFiles by default merges json files', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));

  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/bar.json',
      contents: Buffer.from('{"a":1}')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f1',
      path: '/f1/foo/bar.json',
      contents: Buffer.from('{"a":2,"b":[1,2]}')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f2',
      path: '/f2/foo/bar.json',
      contents: Buffer.from('{"b":[2,3]}')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.json');
  t.deepEqual(JSON.parse(files[0].contents.toString()), {
    a:2, b: [1,2,3]
  });
});

test('mergeFiles cleanup single json file', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));

  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/bar.json',
      contents: Buffer.from('{"a":1,}')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.json');
  t.deepEqual(JSON.parse(files[0].contents.toString()), {
    a:1
  });
});

test('mergeFiles by default appends readme file', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));

  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/readme.txt',
      contents: Buffer.from('foo')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f1',
      path: '/f1/foo/readme.txt',
      contents: Buffer.from('bar')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f2',
      path: '/f2/foo/readme.txt',
      contents: Buffer.from('lo')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/readme.txt');
  t.is(files[0].contents.toString(), 'foo\nbar\nlo');
});

test('mergeFiles by default appends readme file, case2', async t => {
  const merge = mergeFiles();
  const files = [];
  merge.on('data', file => files.push(file));

  setTimeout(() => {
    merge.write(new Vinyl({
      cwd: '/',
      base: '/test',
      path: '/test/foo/README',
      contents: Buffer.from('foo')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f1',
      path: '/f1/foo/README',
      contents: Buffer.from('bar')
    }));
    merge.write(new Vinyl({
      cwd: '/',
      base: '/f2',
      path: '/f2/foo/README',
      contents: Buffer.from('lo')
    }));

    merge.end();
  });

  await once(merge, 'end');
  t.is(files.length, 1);
  t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/README');
  t.is(files[0].contents.toString(), 'foo\nbar\nlo');
});
