const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const hostedGit = require('hosted-git-info');
const https = require('https');
const gunzip = require('gunzip-maybe');
const tar = require('tar-fs');
const {info} = require('./log');

function resolveRepo(supplier) {
  const r = hostedGit.fromUrl(supplier);
  if (r) return {
    shortcut: r.shortcut(),
    tarball: r.tarball()
  };
}

function ensureTmpFolder() {
  const folder = path.join(os.tmpdir(), 'makes');
  try {
    fs.mkdirSync(folder);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  return folder;
}

function generateHash(bufOrStr) {
  return crypto.createHash('md5').update(bufOrStr).digest('hex');
}

function isDir(dir) {
  try {
    const stats = fs.statSync(dir);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}

async function useCached(folder, hash, generate) {
  const target = path.join(folder, hash);
  if (!isDir(target)) {
    await generate(target);
  }

  const files = fs.readdirSync(target);
  if (files.length === 1) {
    return path.join(target, files[0]);
  }
  return target;
}

module.exports = async function(supplier, {
  _resolve = resolveRepo,
  _tmpFolder
} = {}) {
  // local folder
  if (supplier.startsWith('.')) {
    if (isDir(supplier)) {
      info('Using local skeleton ' + supplier);
      return supplier;
    }
    throw new Error(`Local folder "${supplier}" does not exist.`);
  }

  // for "something" or "github:something"
  // turn to "something/new" or "github:something/new"
  if (supplier.match(/^([a-zA-Z0-9-_]+:)?[a-zA-Z0-9-_]+$/)) {
    supplier += '/new';
  }

  const result = await _resolve(supplier);
  if (!result) {
    throw new Error('Cannot find git repo ' + supplier);
  }

  info('Using remote skeleton ' + result.shortcut);

  if (!_tmpFolder) {
    _tmpFolder = ensureTmpFolder();
  }

  return await useCached(
    _tmpFolder,
    generateHash(result.tarball),
    target => {
      info('Fetching tarball ' + result.tarball);
      return new Promise((resolve, reject) => {
        https.get(result.tarball, res => {
          if (res.statusCode == 200) {
            res.pipe(gunzip())
              .pipe(tar.extract(target))
              .once('error', reject)
              .once('finish', resolve);
          } else {
            reject(new Error(`${res.statusCode} ${res.statusMessage}`));
          }
        });
      });
    }
  );
};
