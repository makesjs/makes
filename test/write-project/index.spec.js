import test from 'ava';
import writeProject from '../../lib/write-project';
import mockfs from 'mock-fs';
import fs from 'fs';
import path from 'path';
import through2 from 'through2';

test.afterEach(() => {
  mockfs.restore();
});

test.serial.cb('writeProject merges all features folders', t => {
  mockfs({
    'skeleton/common/file-a.js': 'file-a',
    'skeleton/feature1/file-b.js': 'file-b',
    'skeleton/feature1/folder/file-b2.js': 'file-b2',
    'skeleton/feature2/file-c.json': '{"file":"c"}',
    'skeleton/feature3/file-d.js': 'file-d'
  });

  writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here'
  }).once('error', t.end)
    .once('finish', () => {
      t.deepEqual(
        fs.readdirSync('here').sort(),
        ['file-a.js', 'file-b.js', 'file-d.js', 'folder']
      );
      t.deepEqual(
        fs.readdirSync(path.join('here', 'folder')).sort(),
        ['file-b2.js']
      );
      t.is(
        fs.readFileSync(path.join('here', 'folder', 'file-b2.js'), 'utf8'),
        'file-b2'
      );
      t.end();
    });
});

test.serial.cb('writeProject filters, preprocess, skips/appends file', t => {
  mockfs({
    'skeleton/common/file-a.js__skip-if-exists': 'file-a',
    'skeleton/common/file-a2.js__append-if-exists__if_feature1': 'file-a2',
    'skeleton/feature1/file-b.js': 'file-b',
    'skeleton/feature1/file-b.ts__if_feature4': 'file-b',
    'skeleton/feature1/folder__if_not_feature2/file-b2.js__if_feature3': 'file-b2-/* @echo name */',
    'skeleton/feature2/file-c.json': '{"file":"c"}',
    'skeleton/feature3/file-d.js': 'file-d',
    'here/file-a.js': 'old-file-a',
    'here/file-a2.js': 'old-file-a2\n'
  });

  writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here'
  }).once('error', t.end)
    .once('finish', () => {
      t.deepEqual(
        fs.readdirSync('here').sort(),
        ['file-a.js', 'file-a2.js', 'file-b.js', 'file-d.js', 'folder']
      );
      t.is(
        fs.readFileSync(path.join('here', 'file-a.js'), 'utf8'),
        'old-file-a'
      );
      t.is(
        fs.readFileSync(path.join('here', 'file-a2.js'), 'utf8'),
        'old-file-a2\nfile-a2'
      );
      t.deepEqual(
        fs.readdirSync(path.join('here', 'folder')).sort(),
        ['file-b2.js']
      );
      t.is(
        fs.readFileSync(path.join('here', 'folder', 'file-b2.js'), 'utf8'),
        'file-b2-app'
      );
      t.end();
    });
});

test.serial.cb('writeProject supports prependTransforms and appendTransforms', t => {
  mockfs({
    'skeleton/common/intro.md': 'intro',
    'skeleton/feature1/folder/file-b.ext__if_feature3': 'file-b',
    'here/intro.md': 'old intro\n'
  });

  writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here',
    prependTransforms: [
      function(properties, features) {
        return through2.obj(function(file, enc, cb) {
          if (file.isBuffer() && features.includes('feature3') && file.basename === 'intro.md') {
            file.basename += '__append-if-exists';
          }
          cb(null, file);
        });
      }
    ],
    appendTransforms: [
      function(properties, features) {
        return through2.obj(function(file, enc, cb) {
          if (file.isBuffer() && file.extname === '.ext') {
            if (features.includes('feature3')) {
              file.extname = '.f3';
            } else {
              file.extname = '.f1';
            }
          }
          cb(null, file);
        });
      }
    ]
  }).once('error', t.end)
    .once('finish', () => {
      t.deepEqual(
        fs.readdirSync('here').sort(),
        ['folder', 'intro.md']
      );
      t.is(
        fs.readFileSync(path.join('here', 'intro.md'), 'utf8'),
        'old intro\nintro'
      );
      t.deepEqual(
        fs.readdirSync(path.join('here', 'folder')).sort(),
        ['file-b.f3']
      );
      t.is(
        fs.readFileSync(path.join('here', 'folder', 'file-b.f3'), 'utf8'),
        'file-b'
      );
      t.end();
    });
});
