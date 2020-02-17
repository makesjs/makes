const test = require('ava');
const markWritePolicy = require('../../lib/write-project/1-mark-write-policy');
const Vinyl = require('vinyl');

test('markWritePolicy skips file without policy mark', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.writePolicy, undefined);
  t.is(newFile.contents.toString(), 'abc');
});

test('markWritePolicy marks write policy skip', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__skip-if-exists',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.writePolicy, 'skip');
  t.is(newFile.contents.toString(), 'abc');
});

test('markWritePolicy marks write policy append', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__append-if-exists',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.writePolicy, 'append');
  t.is(newFile.contents.toString(), 'abc');
});

test('markWritePolicy marks write policy ask', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__ask-if-exists',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.writePolicy, 'ask');
  t.is(newFile.contents.toString(), 'abc');
});

test('markWritePolicy marks write policy, keeps other file name parts', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__skip-if-exists__something',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any__something');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any__something');
  t.is(newFile.writePolicy, 'skip');
  t.is(newFile.contents.toString(), 'abc');
});

test('markWritePolicy marks write policy, keeps other file name parts, case2', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any__something__skip-if-exists',
    contents: Buffer.from('abc')
  });
  const newFile = markWritePolicy(file);
  t.is(newFile.basename, 'file.any__something');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any__something');
  t.is(newFile.writePolicy, 'skip');
  t.is(newFile.contents.toString(), 'abc');
});
