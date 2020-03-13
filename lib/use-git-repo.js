const path = require('path');
const rimraf = require('rimraf');
const {info} = require('./log');
const {folderExists} = require('./file-exists');
const run = require('./run');

// mainly for private skeleton repo.
// Note: no test coverage.
module.exports = async function useGitRepo(folder, {git, https, gitFolder, committish}) {
  const target = path.join(folder, gitFolder);

  if (folderExists(target)) {
    await new Promise((resolve, reject) => {
      rimraf(target, {glob: false}, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  try {
    info(`Preparing skeleton: git clone ${git} ${gitFolder}`);
    await run('git', ['clone', git, gitFolder], folder);
  } catch (err) {
    info(`Try https: git clone ${https} ${gitFolder}`);
    await run('git', ['clone', https, gitFolder], folder);
  }

  if (committish && committish !== 'master') {
    info(`Preparing skeleton: git checkout ${committish}`);
    await run('git', ['checkout', committish], target);
  }

  info(`Skeleton is ready at ${target}\n`);
  return target;
};
