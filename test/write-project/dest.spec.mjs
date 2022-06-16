import {test} from 'zora';
import dest from '../../lib/write-project/dest.js';
import mockfs from 'mock-fs';
import fs from 'fs';
import path from 'path';
import {PassThrough} from 'stream';
import Vinyl from 'vinyl';

await test('dest writes nothing', async t => {
  mockfs();

  await new Promise((resolve) => {
    const rs = new PassThrough({objectMode: true});

    rs.pipe(dest('target'))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
      .once('finish', () => {
        try {
          fs.readdirSync('target');
          t.fail('should not pass');
        } catch (err) {
          t.is(err.code, 'ENOENT');
        }
        resolve();
      });
    rs.end();
  });

  mockfs.restore();
});

await test('dest writes files, overwrites existing files', async t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  await new Promise((resolve) => {
    const rs = new PassThrough({objectMode: true});

    rs.pipe(dest('target'))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
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
        resolve();
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

  mockfs.restore();
});

await test('dest writes files, appends existing files', async t => {
  mockfs({
    'target/file-a.js': 'old-a'
  });

  await new Promise((resolve) => {
    const rs = new PassThrough({objectMode: true});

    rs.pipe(dest('target'))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
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
        resolve();
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

  mockfs.restore();
});

await test('dest ignores conflicting file and folder', async t => {
  mockfs({
    'target/a': 'old-a'
  });

  await new Promise((resolve) => {
    const rs = new PassThrough({objectMode: true});

    rs.pipe(dest('target'))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
      .once('finish', () => {
        t.deepEqual(
          fs.readdirSync('target').sort(),
          ['a']
        );

        t.is(fs.readFileSync(path.join('target', 'a'), 'utf8'), 'old-a');
        resolve();
      });

    rs.write(new Vinyl({
      base: 'skeleton/common',
      path: 'skeleton/common/a/file.js',
      contents: Buffer.from('a')
    }));

    rs.end();
  });

  mockfs.restore();
});
