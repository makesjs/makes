import test from 'ava';
import dest from '../../lib/write-project/dest';
import mockfs from 'mock-fs';
import fs from 'fs';
import path from 'path';
import {Readable} from 'stream';
import Vinyl from 'vinyl';

test.afterEach(() => {
  mockfs.restore();
});

test.serial.cb('dest writes nothing', t => {
  mockfs();

  const rs = new Readable({objectMode: true});

  rs.pipe(dest('target'))
    .once('error', t.end)
    .once('finish', () => {
      t.throws(() => fs.readdirSync('target'), {code: 'ENOENT'});
      t.end();
    });

  rs.push(null);
});

test.serial.cb('dest writes files, overwrites existing files', t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  const rs = new Readable({objectMode: true});

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

  rs.push(new Vinyl({
    base: 'skeleton/common',
    path: 'skeleton/common/file-a.js',
    contents: Buffer.from('a')
  }));

  rs.push(new Vinyl({
    base: 'skeleton/feature1',
    path: 'skeleton/feature1/f1/file-b.md',
    contents: Buffer.from('b')
  }));

  rs.push(null);
});

test.serial.cb('dest writes files, appends existing files', t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  const rs = new Readable({objectMode: true});

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

  rs.push(new Vinyl({
    base: 'skeleton/common',
    path: 'skeleton/common/file-a.js',
    contents: Buffer.from('a'),
    writePolicy: 'append'
  }));

  rs.push(new Vinyl({
    base: 'skeleton/feature1',
    path: 'skeleton/feature1/f1/f2/file-b.md',
    contents: Buffer.from('b'),
    writePolicy: 'append'
  }));

  rs.push(null);
});