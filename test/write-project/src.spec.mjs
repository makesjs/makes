import {test} from 'zora';
import src from '../../lib/write-project/src.js';
import mockfs from 'mock-fs';
import {Transform} from 'stream';
import _ from 'lodash';

const gatherFiles = function(box) {
  return new Transform({
    objectMode: true,
    transform: (file, enc, cb) => {
      if (file.isBuffer()) {
        box.push({
          path: file.relative.replace(/\\/g, '/'),
          contents: file.contents.toString('utf8')
        });
      }
      cb();
    }
  });
};

await test('src reads nothing from empty folders', async t => {
  mockfs();
  const box = [];

  await new Promise(resolve => {
    src()
      .pipe(gatherFiles(box))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
      .once('finish', () => {
        t.deepEqual(box, []);
        resolve();
      });
  });

  mockfs.restore();
});

await test('src reads deep files', async t => {
  mockfs({
    'common/file-a': 'a',
    'common/f1/file-b': 'b',
    'common/f1/f2/file-d': 'd',
    'common/f1/file-c': 'c',
    'feature1/file-a': 'a2',
    'feature1/f1/f2/file-d': 'd2',
    'feature1/f1/f3/file-e': 'e'
  });
  const box = [];

  await new Promise(resolve => {
    src(['common', 'feature1', 'feature3'])
      .pipe(gatherFiles(box))
      .once('error', err => {
        t.fail(err.message);
        resolve();
      })
      .once('finish', () => {
        t.deepEqual(_.sortBy(box, 'path'), [
          {path: 'f1/f2/file-d', contents: 'd'},
          {path: 'f1/f2/file-d', contents: 'd2'},
          {path: 'f1/f3/file-e', contents: 'e'},
          {path: 'f1/file-b', contents: 'b'},
          {path: 'f1/file-c', contents: 'c'},
          {path: 'file-a', contents: 'a'},
          {path: 'file-a', contents: 'a2'},
        ]);
        resolve();
      });
  });

  mockfs.restore();
});
