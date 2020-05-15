const test = require('ava');
const writeProject = require('../../lib/write-project');
const mockfs = require('mock-fs');
const fs = require('fs');
const path = require('path');
const {Transform} = require('stream');

test.afterEach(() => {
  mockfs.restore();
});

test.serial('writeProject merges all features folders', async t => {
  mockfs({
    'skeleton/common/file-a.js': 'file-a',
    'skeleton/feature1/file-b.js': 'file-b',
    'skeleton/feature1/folder/file-b2.js': 'file-b2',
    'skeleton/feature2/file-c.json': '{"file":"c"}',
    'skeleton/feature3/file-d.js': 'file-d'
  });

  await writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here'
  });

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
});

test.serial('writeProject filters, preprocess, skips/appends file', async t => {
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

  await writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here'
  });

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
});

test.serial('writeProject supports prependTransforms and appendTransforms', async t => {
  mockfs({
    'skeleton/common/intro.md': 'intro',
    'skeleton/feature1/folder/file-b.ext__if_feature3': 'file-b',
    'here/intro.md': 'old intro\n'
  });

  await writeProject({
    properties: {name: 'app'},
    features: ['feature1', 'feature3'],
    skeletonDir: 'skeleton',
    targetDir: 'here',
    prependTransforms: [
      function(properties, features, targetDir, unattended, prompts) {
        t.deepEqual(properties, {name: 'app'});
        t.deepEqual(features, ['feature1', 'feature3']);
        t.is(targetDir, 'here');
        t.is(typeof prompts.text, 'function');
        return new Transform({
          objectMode: true,
          transform: function(file, enc, cb) {
            if (file.isBuffer() && features.includes('feature3') && file.basename === 'intro.md') {
              file.basename += '__append-if-exists';
            }
            cb(null, file);
          }
        });
      }
    ],
    appendTransforms: [
      function(properties, features, targetDir, unattended, prompts) {
        t.deepEqual(properties, {name: 'app'});
        t.deepEqual(features, ['feature1', 'feature3']);
        t.is(targetDir, 'here');
        t.is(typeof prompts.text, 'function');
        return new Transform({
          objectMode: true,
          transform: function(file, enc, cb) {
            if (file.isBuffer() && file.extname === '.ext') {
              if (features.includes('feature3')) {
                file.extname = '.f3';
              } else {
                file.extname = '.f1';
              }
            }
            cb(null, file);
          }
        });
      }
    ]
  });

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
});

test.serial('writeProject reports error', async t => {
  mockfs({
    'skeleton/feature1/file.js': '// @if feature2\na\n',
  });

  try {
    await writeProject({
      properties: {name: 'app'},
      features: ['feature1'],
      skeletonDir: 'skeleton',
      targetDir: 'here'
    });
  } catch (e) {
    t.truthy(e.message.startsWith(`Error in skeleton file: ${path.join('skeleton', 'feature1', 'file.js')}\nCould not find an ending @endif for the @if`));
    return;
  }

  t.fail('should not be here');
});
