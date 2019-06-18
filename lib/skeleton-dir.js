const fs = require('fs');
const path = require('path');
const hostedGit = require('hosted-git-info');
const https = require('https');
const {URL} = require('url');
const gunzip = require('gunzip-maybe');
const tar = require('tar-fs');
const {info, warn} = require('./log');
const {folderExists} = require('./file-exists');
const useGitRepo = require('./use-git-repo');
const tmp = require('tmp');
tmp.setGracefulCleanup();

function resolveRepo(supplier) {
  const r = hostedGit.fromUrl(supplier);
  if (r) return {
    shortcut: r.shortcut(),
    tarball: r.tarball(),
    git: `git@${r.domain}:${r.user}/${r.project}.git`,
    gitFolder: `${r.domain}-${r.user}-${r.project}`,
    committish: r.committish
  };
}

function getHash(tarball) {
  const url = new URL(tarball);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      search: url.search,
      method: 'HEAD'
    }, res => {
      if (res.statusCode === 200) {
        let hash;
        if (res.headers.etag) {
          hash = res.headers.etag;
        } else if (res.headers['content-disposition']) {
          const m = res.headers['content-disposition'].match(/filename=(.+)$/);
          if (m) hash = m[1];
        }

        if (hash) {
          // remove quotes
          resolve(hash.replace(/^("|')|("|')$/g, ''));
        } else {
          reject(new Error('Unable to get unique file name for ' + tarball));
        }
      } else {
        reject(new Error('Unable to get ' + tarball));
      }
    });
    req.on('error', reject);
    req.end();
  });
}

async function finalFolder(target, generate) {
  await generate(target);

  const files = fs.readdirSync(target).filter(n => n !== '.keep');
  if (files.length === 1) {
    return path.join(target, files[0]);
  }
  return target;
}

module.exports = async function(supplier, {
  _resolve = resolveRepo,
  _useGitRepo = useGitRepo,
  _tmpFolder
} = {}) {
  // local folder
  if (supplier.match(/^(\.|\/|\\|[a-z]:)/i)) {
    if (folderExists(supplier)) {
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
    _tmpFolder = tmp.dirSync({unsafeCleanup: true}).name;
  }

  try {
    await getHash(result.tarball);
  } catch (e) {
    warn(e.message);
    warn('Maybe this is a private skeleton.');
    return await _useGitRepo(_tmpFolder, result);
  }

  return await finalFolder(
    _tmpFolder,
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
        }).on('error', reject);
      });
    }
  );
};
