const fs = require('fs');
const path = require('path');
const {fileExists, folderExists} = require('./file-exists');
const {info} = require('./log');
const run = require('./run');
const normalisedImport = require('./normalised-import');

const defaultNamePrompt = {
  name: 'name',
  message: 'Please name this new project:',
  default: 'my-app',
  validate: value => value.match(/^[.a-zA-Z0-9_-]+$/) ? null :
    'Please only use letters, numbers, dot(.), dash(-) and underscore(_).'
};

module.exports = async function (dir, {
  _npmInstall = npmInstall,
  _import = normalisedImport
} = {}) {
  const metaFile = path.join(dir, 'package.json');
  const nodeModules = path.join(dir, 'node_modules');
  if (fileExists(metaFile) && !folderExists(nodeModules)) {
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    if (meta.dependencies && Object.keys(meta.dependencies).length) {
      await _npmInstall(dir);
    }
  }

  let questions;
  const qs = await _import(path.join(dir, 'questions'));
  if (qs) questions = qs.default;

  if (!questions) questions = [];

  const namePromptIdx = questions.findIndex(q => q.name === 'name');
  let nameQuestion;

  if (namePromptIdx >= 0) {
    const [overrideNameQuestion] = questions.splice(namePromptIdx, 1);

    nameQuestion = {
      ...defaultNamePrompt,
      ...overrideNameQuestion
    };
  } else {
    // no question asking project name, use default;
    nameQuestion = {...defaultNamePrompt};
  }

  let prepend, append;
  const t = await _import(path.join(dir, 'transforms'));
  if (t) {
    prepend = t.prepend;
    append = t.append;
  }

  if (prepend && !Array.isArray(prepend)) {
    prepend = [prepend];
  }

  if (append && !Array.isArray(append)) {
    append = [append];
  }

  const bannerFile = path.join(dir, 'banner');
  let banner;
  if (fileExists(bannerFile)) {
    banner = fs.readFileSync(bannerFile, 'utf8');
  }

  let before;
  const bef = await _import(path.join(dir, 'before'));
  if (bef) before = bef.default;

  let after;
  const aft = await _import(path.join(dir, 'after'));
  if (aft) after = aft.default;

  return {
    nameQuestion,
    questions: questions || [],
    prependTransforms: prepend || [],
    appendTransforms: append || [],
    banner,
    before,
    after
  };
};

function npmInstall(dir) {
  info('Skeleton requires additional dependencies. Running npm i --only=prod');
  return run('npm', ['i', '--only=prod'], dir);
}
