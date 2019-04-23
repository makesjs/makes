import test from 'ava';
import skeletonDir from '../lib/skeleton-dir';
import mockfs from 'mock-fs';
import path from 'path';
import fs from 'fs';

test.afterEach(() => {
  mockfs.restore();
});

test.serial('skeletonDir simply returns local dir', async t => {
  mockfs({
    '../my/dir/.keep': '',
    './my/dir/.keep': '',
    '/my/dir/.keep': ''
  });
  t.is(await skeletonDir('../my/dir'), '../my/dir');
  t.is(await skeletonDir('./my/dir'), './my/dir');
  t.is(await skeletonDir('/my/dir'), '/my/dir');
});

test.serial('skeletonDir complains about missing local dir', async t => {
  mockfs();
  await t.throwsAsync(async() => skeletonDir('./my/dir'));
});

test.serial('skeletonDir complains about unresolved repo', async t => {
  function resolveRepo() {}

  await t.throwsAsync(async() => skeletonDir('something', {
    _resolve: resolveRepo
  }));
});

test.serial('skeletonDir complains about non-existing repo', async t => {
  await t.throwsAsync(async() => skeletonDir('huochunpeng/not-exist'));
});

test.serial('skeletonDir returns tmp folder untar github repo, and caches it', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = 'huochunpeng/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  const dir2 = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.is(dir2, dir);
  t.truthy(fs.readdirSync(dir2).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir2, 'README.md'), 'utf8').includes('debug repo for npm'));
});

test.serial('skeletonDir returns tmp folder untar bitbucket repo, and caches it', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = 'bitbucket:huochunpeng/debug-npm#v1.0.0';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  const dir2 = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.is(dir2, dir);
  t.truthy(fs.readdirSync(dir2).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir2, 'README.md'), 'utf8').includes('debug repo for npm'));
});

test.serial('skeletonDir returns tmp folder untar gitlab repo, and caches it', async t => {
  mockfs({
    'tmp/.keep': ''
  });

  const repo = 'gitlab:huochunpeng/debug-npm';

  const dir = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.truthy(fs.readdirSync(dir).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir, 'README.md'), 'utf8').includes('debug repo for npm'));

  const dir2 = await skeletonDir(repo, {_tmpFolder: 'tmp'});
  t.is(dir2, dir);
  t.truthy(fs.readdirSync(dir2).includes('README.md'));
  t.truthy(fs.readFileSync(path.join(dir2, 'README.md'), 'utf8').includes('debug repo for npm'));
});


