import {test, skip} from 'zora';
import skeletonDir from '../lib/skeleton-dir.js';
import tmpDir from '../lib/tmp-dir.js';
import mockfs from 'mock-fs';
import os from 'os';
import path from 'path';
import fs from 'fs';

const {cleanup} = tmpDir;
const systemTmpDir = os.tmpdir();

function _useGitRepo() {
  throw new Error('Not implemented');
}

await test('skeletonDir simply returns local dir', async t => {
  mockfs({
    '../my/dir/.keep': '',
    './my/dir/.keep': '',
    '/my/dir/.keep': '',
    [systemTmpDir]: {}
  });

  t.is(await skeletonDir('../my/dir', {_useGitRepo}), '../my/dir');
  t.is(await skeletonDir('./my/dir', {_useGitRepo}), './my/dir');
  t.is(await skeletonDir('/my/dir', {_useGitRepo}), '/my/dir');

  cleanup();
  mockfs.restore();
});

await test('skeletonDir complains about missing local dir', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  try {
    await skeletonDir('./my/dir', {_useGitRepo});
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }

  cleanup();
  mockfs.restore();
});

await test('skeletonDir complains about unresolved repo', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  function resolveRepo() {}

  try {
    await skeletonDir('something', {
      _resolve: resolveRepo, _useGitRepo
    });
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }

  cleanup();
  mockfs.restore();
});

await test('skeletonDir complains about non-existing repo', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  try {
    await skeletonDir('3cp/not-exist', {_useGitRepo});
    t.fail('should not pass');
  } catch (e) {
    t.ok(e, e.message);
  }

  cleanup();
  mockfs.restore();
});

await test('skeletonDir returns tmp folder untar github repo', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  const repo = '3cp/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  cleanup();
  mockfs.restore();
});

await test('skeletonDir returns tmp folder untar bitbucket repo', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  const repo = 'bitbucket:huochunpeng/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  cleanup();
  mockfs.restore();
});

// Found at 25/04/2021: now somehow GitLab asks login before downloading tarball.
await skip('skeletonDir returns tmp folder untar gitlab repo', async t => {
  mockfs({
    [systemTmpDir]: {}
  });

  const repo = 'gitlab:huochunpeng/debug-npm';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  cleanup();
  mockfs.restore();
});
