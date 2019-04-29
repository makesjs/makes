const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {fileExists} = require('./file-exists');
const {info} = require('./log');

const defaultNamePrompt = {
  name: 'name',
  message: 'Please name this new project:',
  default: 'my-app',
};

module.exports = async function(dir, {
  _npmInstall = npmInstall,
  _require = require
} = {}) {
  const metaFile = path.join(dir, 'package.json');
  if (fileExists(metaFile)) {
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
    questions.unshift(defaultNamePrompt);
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

  return {
    questions: questions || [],
    prependTransforms: prepend || [],
    appendTransforms: append || []
  };
};

function npmInstall(dir) {
  info('Skeleton requires additional dependencies.');
  return new Promise((resolve, reject) => {
    spawn(
      'npm',
      ['i', '--only=prod'],
      { stdio: 'inherit', cwd: dir }
    ).on('close', resolve).on('error', reject);
  });
}
