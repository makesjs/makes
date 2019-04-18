import test from 'ava';
import src from '../../lib/write-project/src';
import mockfs from 'mock-fs';
import through2 from 'through2';
import _ from 'lodash';

const gatherFiles = function(box) {
  return through2.obj((file, enc, cb) => {
    if (file.isBuffer()) {
      box.push({
        path: file.relative.replace(/\\/g, '/'),
        contents: file.contents.toString('utf8')
      });
    }
    cb();
  });
};

test.afterEach(() => {
  mockfs.restore();
});

test.serial.cb('src reads nothing from empty folders', t => {
  mockfs();
  const box = [];

  src()
    .pipe(gatherFiles(box))
    .once('error', t.end)
    .once('finish', () => {
      t.deepEqual(box, []);
      t.end();
    });
});

test.serial.cb('src reads deep files from empty folders', t => {
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

  src(['common', 'feature1', 'feature3'])
    .pipe(gatherFiles(box))
    .once('error', t.end)
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
      t.end();
    });
});
