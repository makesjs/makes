import {test, skip} from 'zora';
import skeletonDir from '../lib/skeleton-dir.js';
import mockfs from 'mock-fs';
import path from 'path';
import fs from 'fs';

function _useGitRepo() {
  throw new Error('Not implemented');
}

await test('skeletonDir simply returns local dir', async t => {
  mockfs({
    '../my/dir/.keep': '',
    './my/dir/.keep': '',
    '/my/dir/.keep': ''
  });
  t.is(await skeletonDir('../my/dir', {_useGitRepo}), '../my/dir');
  t.is(await skeletonDir('./my/dir', {_useGitRepo}), './my/dir');
  t.is(await skeletonDir('/my/dir', {_useGitRepo}), '/my/dir');
  mockfs.restore();
});

await test('skeletonDir complains about missing local dir', async t => {
  mockfs();
  try {
    await skeletonDir('./my/dir', {_useGitRepo});
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }
  mockfs.restore();
});

await test('skeletonDir complains about unresolved repo', async t => {
  function resolveRepo() {}

  try {
    await skeletonDir('something', {
      _resolve: resolveRepo, _useGitRepo
    });
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }
  mockfs.restore();
});

await test('skeletonDir complains about non-existing repo', async t => {
  try {
    await skeletonDir('3cp/not-exist', {_useGitRepo});
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }
});

await test('skeletonDir returns tmp folder untar github repo', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = '3cp/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp', _useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
  mockfs.restore();
});

await test('skeletonDir returns tmp folder untar bitbucket repo', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = 'bitbucket:huochunpeng/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp', _useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
  mockfs.restore();
});

// Found at 25/04/2021: now somehow GitLab asks login before downloading tarball.
await skip('skeletonDir returns tmp folder untar gitlab repo', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = 'gitlab:huochunpeng/debug-npm';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp', _useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
  mockfs.restore();
});
