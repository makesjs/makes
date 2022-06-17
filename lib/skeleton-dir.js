import fs from 'fs';
import path from 'path';
import hostedGit from 'hosted-git-info';
import https from 'https';
import {URL} from 'url';
import {createGunzip} from 'zlib';
import tar from 'tar-fs';
import {info, warn} from './log.js';
import {folderExists} from './file-exists.js';
import useGitRepo from './use-git-repo.js';
import SoftError from './soft-error.js';
import getAgent from './get-https-proxy-agent.js';
import tmpDir from './tmp-dir.js';

const agent = getAgent();

function resolveRepo(supplier) {
  const r = hostedGit.fromUrl(supplier);
  if (r) return {
    shortcut: r.shortcut(),
    tarball: r.tarball(),
    git: r.ssh({noCommittish: true}),
    https: r.https({noCommittish: true, noGitPlus: true}),
    gitFolder: `${r.domain}-${r.user}-${r.project}`.replace(/\\|\//g, '-'),
    committish: r.committish
  };
}

async function finalFolder(target, generate) {
  await generate(target);

  const files = fs.readdirSync(target).filter(n => n !== '.keep');
  if (files.length === 1) {
    return path.join(target, files[0]);
  }
  return target;
}

export default async function (supplier, {
  _resolve = resolveRepo,
  _useGitRepo = useGitRepo
} = {}) {
  // local folder
  if (supplier.match(/^(\.|\/|\\|[a-z]:)/i)) {
    if (folderExists(supplier)) {
      info('Using local skeleton ' + supplier);
      return supplier;
    }
    throw new SoftError(`Local folder "${supplier}" does not exist.`);
  }

  // for "something" or "github:something"
  // turn to "something/new" or "github:something/new"
  if (supplier.match(/^([a-zA-Z0-9-_]+:)?[a-zA-Z0-9-_]+$/)) {
    supplier += '/new';
  }

  // On windows, somewhere (npm/npx/nodejs) rewrote
  // "makes aurelia/v1" into "makes aurelia\v1".
  // Bypass this windows issue here.
  supplier = supplier.replace('\\', '/');

  const result = _resolve(supplier);
  if (!result) {
    throw new SoftError('Cannot find git repo ' + supplier);
  }

  info('Using remote skeleton ' + result.shortcut);

  const _tmpFolder = tmpDir();

  return finalFolder(
    _tmpFolder,
    target => {
      info('Fetching tarball ' + result.tarball);
      const url = new URL(result.tarball);
      return new Promise((resolve, reject) => {
        https.get(
          {
            host: url.hostname,
            path: url.pathname + url.search,
            agent
          },
          res => {
            if (res.statusCode == 200) {
              res.pipe(createGunzip())
                .pipe(tar.extract(target))
                .once('error', reject)
                .once('finish', resolve);
            } else {
              reject(new SoftError(`Unable to download ${result.tarball}\n${res.statusCode} ${res.statusMessage}`));

            }
          }
        ).on('error', reject);
      }).catch(e => {
        warn(e.message);
        warn('Maybe this is a private skeleton.');
        return _useGitRepo(_tmpFolder, result);
      });
    }
  );
}
