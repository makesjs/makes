import path from 'path';
import {info} from './log.js';
import run from './run.js';

// mainly for private skeleton repo.
// Note: no test coverage.
export default async function useGitRepo(folder, {git, https, gitFolder, committish}) {
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
}
