const ansiColors = require('ansi-colors');
const sisteransi = require('sisteransi');
const writeProject = require('./write-project');
const skeletonDir = require('./skeleton-dir');
const skeletonConfig = require('./skeleton-config');
const runQuestionnaire = require('./run-questionnaire');
const {info} = require('./log');
const fs = require('fs');
const prompts = require('./prompts');
const run = require('./run');
const SoftError = require('./soft-error');
const possibleFeatureSelections = require('./possible-feature-selections');

function ensureNameIsAvailable(name) {
  let stats;
  try {
    stats = fs.statSync(name);
  } catch (e) {
    return;
  }
  if (stats.isDirectory()) {
    return `folder "${name}" exists.`;
  } else {
    // stats exists, but it's not a directory.
    return `Cannot create directory  "${name}".`;
  }
}

async function makes(supplier, {
  predefinedProperties = {},
  preselectedFeatures = [],
  unattended = false,
  here = false
} = {}, {
  // debug or test
  _skeletonDir = skeletonDir,
  _skeletonConfig = skeletonConfig,
  _runQuestionnaire = runQuestionnaire,
  _writeProject = writeProject
} = {}) {
  if (unattended && !predefinedProperties.name) {
    throw new SoftError('Please provide a project name for silent mode, like\n' +
      ansiColors.inverse(` npx makes ${supplier} <project-name> -s ${preselectedFeatures.join(',')}${preselectedFeatures.length ? ' ' : ''}`));
  }

  let skeletonDirectory = await _skeletonDir(supplier);

  const {
    nameQuestion,
    questions,
    prependTransforms,
    appendTransforms,
    banner,
    before,
    after} = await _skeletonConfig(skeletonDirectory);

  if (banner) {
    console.log('\n' + banner + '\n');
  }

  if (!here) {
    // ensure target folder is available
    const oldValidate = nameQuestion.validate;
    nameQuestion.validate = async value => {
      if (oldValidate) {
        const valid = await oldValidate(value);
        if ((typeof valid === 'string' && valid) || valid === false) {
          // rejected
          return valid;
        }
      }
      return ensureNameIsAvailable(value);
    };
  }

  // Ask project name before running "before" task
  const [{name}] = await _runQuestionnaire([nameQuestion], {
    unattended,
    predefinedProperties
  });

  let silentQuestions = false;
  if (typeof before === 'function') {
    const result = await before({
      unattended,
      here,
      preselectedFeatures: [...preselectedFeatures],
      predefinedProperties: {...predefinedProperties},
      prompts,
      ansiColors,
      sisteransi
    }) || {};

    // "before" task can
    // 1. silence questions (silentQuestions).
    // 2. override preselectedFeatures.
    // 3. override predefinedProperties.
    // "before" task should also respect existing silent mode (unattended).
    if (result.hasOwnProperty('silentQuestions')) {
      silentQuestions = result.silentQuestions;
    }

    if (result.hasOwnProperty('preselectedFeatures')) {
      preselectedFeatures = result.preselectedFeatures;
    }

    if (result.hasOwnProperty('predefinedProperties')) {
      predefinedProperties = result.predefinedProperties;
    }
  }

  const [properties, features, notDefaultFeatures] = await _runQuestionnaire(questions, {
    unattended: unattended || silentQuestions,
    preselectedFeatures,
    predefinedProperties
  });

  if (!name) {
    throw new Error('Unexpected missing project name.');
  }

  const targetDir = here ? '.' : name;
  properties.name = name;

  await _writeProject({
    properties,
    features,
    skeletonDir: skeletonDirectory,
    targetDir,
    unattended,
    prependTransforms,
    appendTransforms
  });

  info(`Project ${properties.name} has been created.`);

  if (typeof after === 'function') {
    // "after" task can for example run `npm install` or `yarn`
    // "after" task should respect silent mode (unattended).
    await after({
      unattended,
      here,
      features,
      notDefaultFeatures,
      properties,
      prompts,
      ansiColors,
      sisteransi,
      run: (cmd, args) => run(cmd, args, targetDir)
    });
  }
}

makes.getOpts = require('./get-opts');
makes.prompts = prompts;
makes.possibleFeatureSelections = possibleFeatureSelections;
module.exports = makes;

