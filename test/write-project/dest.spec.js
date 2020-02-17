const test = require('ava');
const dest = require('../../lib/write-project/dest');
const mockfs = require('mock-fs');
const fs = require('fs');
const path = require('path');
const {PassThrough} = require('stream');
const Vinyl = require('vinyl');

test.afterEach(() => {
  mockfs.restore();
});

test.serial.cb('dest writes nothing', t => {
  mockfs();

  const rs = new PassThrough({objectMode: true});

  rs.pipe(dest('target'))
    .once('error', t.end)
    .once('finish', () => {
      t.throws(() => fs.readdirSync('target'), {code: 'ENOENT'});
      t.end();
    });

  rs.end();
});

test.serial.cb('dest writes files, overwrites existing files', t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  const rs = new PassThrough({objectMode: true});

  rs.pipe(dest('target'))
    .once('error', t.end)
    .once('finish', () => {
      t.deepEqual(
        fs.readdirSync('target').sort(),
        ['f1', 'file-a.js']
      );

      t.is(fs.readFileSync(path.join('target', 'file-a.js'), 'utf8'), 'a');
      t.deepEqual(
        fs.readdirSync(path.join('target', 'f1')).sort(),
        ['file-b.md']
      );
      t.is(fs.readFileSync(path.join('target', 'f1', 'file-b.md'), 'utf8'), 'b');
      t.end();
    });

  rs.write(new Vinyl({
    base: 'skeleton/common',
    path: 'skeleton/common/file-a.js',
    contents: Buffer.from('a')
  }));

  rs.write(new Vinyl({
    base: 'skeleton/feature1',
    path: 'skeleton/feature1/f1/file-b.md',
    contents: Buffer.from('b')
  }));

  rs.end();
});

test.serial.cb('dest writes files, appends existing files', t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  const rs = new PassThrough({objectMode: true});

  rs.pipe(dest('target'))
    .once('error', t.end)
    .once('finish', () => {
      t.deepEqual(
        fs.readdirSync('target').sort(),
        ['f1', 'file-a.js']
      );

      t.is(fs.readFileSync(path.join('target', 'file-a.js'), 'utf8'), 'old-aa');
      t.deepEqual(
        fs.readdirSync(path.join('target', 'f1', 'f2')).sort(),
        ['file-b.md']
      );
      t.is(fs.readFileSync(path.join('target', 'f1', 'f2', 'file-b.md'), 'utf8'), 'b');
      t.end();
    });

  rs.write(new Vinyl({
    base: 'skeleton/common',
    path: 'skeleton/common/file-a.js',
    contents: Buffer.from('a'),
    writePolicy: 'append'
  }));

  rs.write(new Vinyl({
    base: 'skeleton/feature1',
    path: 'skeleton/feature1/f1/f2/file-b.md',
    contents: Buffer.from('b'),
    writePolicy: 'append'
  }));

  rs.end();
});