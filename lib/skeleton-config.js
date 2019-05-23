const fs = require('fs');
const path = require('path');
const {fileExists, folderExists} = require('./file-exists');
const {info} = require('./log');
const run = require('./run');

const defaultNamePrompt = {
  name: 'name',
  message: 'Please name this new project:',
  default: 'my-app',
  validate: value => value.match(/^[a-zA-Z1-9_-]*$/) ? null :
    'Please only use letters, numbers, dash(-) and underscore(_).'
};

function defaultRequire(modulePath) {
  return require(path.resolve(modulePath));
}

module.exports = async function(dir, {
  _npmInstall = npmInstall,
  _require = defaultRequire
} = {}) {
  const metaFile = path.join(dir, 'package.json');
  const nodeModules = path.join(dir, 'node_modules');
  if (fileExists(metaFile) && !folderExists(nodeModules)) {
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    if (meta.dependencies && Object.keys(meta.dependencies).length) {
      await _npmInstall(dir);
    }
  }

  const questionsFile = path.join(dir, 'questions.js');
  let questions;
  if (fileExists(questionsFile)) {
    questions = _require(questionsFile);
  }

  if (!questions) questions = [];

  const namePromptIdx = questions.findIndex(q => q.name === 'name');
  if (namePromptIdx >= 0) {
    questions[namePromptIdx] = {
      ...defaultNamePrompt,
      ...questions[namePromptIdx]
    };
  } else {
    // no question asking project name, add one
    questions.unshift({...defaultNamePrompt});
  }

  const transformsFile = path.join(dir, 'transforms.js');
  let prepend, append;
  if (fileExists(transformsFile)) {
    const t = _require(transformsFile);
    prepend = t.prepend;
    append = t.append;

    if (prepend && !Array.isArray(prepend)) {
      prepend = [prepend];
    }

    if (append && !Array.isArray(append)) {
      append = [append];
    }
  }

  const beforeFile = path.join(dir, 'before.js');
  let before;
  if (fileExists(beforeFile)) {
    before = _require(beforeFile);
  }

  const afterFile = path.join(dir, 'after.js');
  let after;
  if (fileExists(afterFile)) {
    after = _require(afterFile);
  }

  return {
    questions: questions || [],
    prependTransforms: prepend || [],
    appendTransforms: append || [],
    before,
    after
  };
};

function npmInstall(dir) {
  info('Skeleton requires additional dependencies. Running npm i --only=prod');
  return run('npm', ['i', '--only=prod'], dir);
}
