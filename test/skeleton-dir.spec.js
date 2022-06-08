const test = require('ava');
const skeletonDir = require('../lib/skeleton-dir');
const mockfs = require('mock-fs');
const path = require('path');
const fs = require('fs');

function _useGitRepo() {
  throw new Error('Not implemented');
}

test.afterEach(() => {
  // Only first two tests uses mockfs
  mockfs.restore();
});

test.serial('skeletonDir simply returns local dir', async t => {
  mockfs({
    '../my/dir/.keep': '',
    './my/dir/.keep': '',
    '/my/dir/.keep': ''
  });
  t.is(await skeletonDir('../my/dir', {_useGitRepo}), '../my/dir');
  t.is(await skeletonDir('./my/dir', {_useGitRepo}), './my/dir');
  t.is(await skeletonDir('/my/dir', {_useGitRepo}), '/my/dir');
});

test.serial('skeletonDir complains about missing local dir', async t => {
  mockfs();
  await t.throwsAsync(async() => skeletonDir('./my/dir', {_useGitRepo}));
});

test.serial('skeletonDir complains about unresolved repo', async t => {
  function resolveRepo() {}

  await t.throwsAsync(async() => skeletonDir('something', {
    _resolve: resolveRepo, _useGitRepo
  }));
});

test.serial('skeletonDir complains about non-existing repo', async t => {
  await t.throwsAsync(async() => skeletonDir('3cp/not-exist', {_useGitRepo}));
});

test.serial('skeletonDir returns tmp folder untar github repo', async t => {
  const repo = '3cp/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
});

test.serial('skeletonDir returns tmp folder untar bitbucket repo', async t => {
  const repo = 'bitbucket:huochunpeng/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
});

// Found at 25/04/2021: now somehow GitLab asks login before downloading tarball.
test.serial.skip('skeletonDir returns tmp folder untar gitlab repo', async t => {
  const repo = 'gitlab:huochunpeng/debug-npm';

  const dir = await skeletonDir(repo, {_useGitRepo});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));
});
