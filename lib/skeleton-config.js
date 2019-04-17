const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const fileExists = require('./file-exists');
const _ = require('lodash');

module.exports = async function(dir, {
  _npmInstall = npmInstall,
  _require = require
} = {}) {
  const metaFile = path.join(dir, 'package.json');
  if (fileExists(metaFile)) {
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    if (_.size(meta.dependencies) > 0 || _.size(meta.devDependencies) > 0) {
      await _npmInstall(dir);
    }
  }

  const questionsFile = path.join(dir, 'questions.js');
  let questions;
  if (fileExists(questionsFile)) {
    questions = _require(questionsFile);
  }

  if (!questions) questions = [];

  if (!_.some(questions, {name: 'name'})) {
    // no question asking project name, add one
    questions.unshift({
      name: 'name',
      message: 'Please name this project:',
      default: 'my-app'
    });
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
  console.info('Skeleton requires additional dependencies.');
  return new Promise((resolve, reject) => {
    spawn(
      dir,
      ['npm', 'i'],
      { stdio: 'inherit', cwd: dir }
    ).on('close', resolve).on('error', reject);
  });
}
