const path = require('path');
const {info} = require('./log');
const run = require('./run');

// mainly for private skeleton repo.
// Note: no test coverage.
module.exports = async function useGitRepo(folder, {git, https, gitFolder, committish}) {
  const target = path.join(folder, gitFolder);

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
