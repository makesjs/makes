const test = require('ava');
const preprocess = require('../../lib/write-project/3-preprocess');
const Vinyl = require('vinyl');

const pp = preprocess({name: 'app'}, ['a', 'b']);

test('preprocess bypass non utf8 file', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any',
    contents: Buffer.from([0xff])
  });
  const newFile = pp(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.contents.length, 1);
  t.is(newFile.contents[0], 0xff);
});

test('preprocess process in html format', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.xml',
    contents: Buffer.from('<xml><name><!-- @echo name --></name></xml>')
  });
  const newFile = pp(file);
  t.is(newFile.basename, 'file.xml');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.xml');
  t.is(newFile.contents.toString(), '<xml><name>app</name></xml>');
});

test('preprocess process in js format', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any',
    contents: Buffer.from(`hello
// @if a && b
world!
// @endif
`)
  });
  const newFile = pp(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.contents.toString(), 'hello\nworld!\n');
});

test('preprocess process file without any macro', t => {
  const file = new Vinyl({
    cwd: '/',
    base: '/test/',
    path: '/test/file.any',
    contents: Buffer.from(`hello
world!
`)
  });
  const newFile = pp(file);
  t.is(newFile.basename, 'file.any');
  t.is(newFile.path.replace(/\\/g, '/'), '/test/file.any');
  t.is(newFile.contents.toString(), 'hello\nworld!\n');
});
