const writeProject = require('./write-project');
const skeletonDir = require('./skeleton-dir');
const skeletonConfig = require('./skeleton-config');
const runQuestionnaire = require('./run-questionnaire');
const {info, error} = require('./log');
const fs = require('fs');
const prompts = require('./prompts');
const run = require('./run');
const ansiColors = require('ansi-colors');
const sisteransi = require('sisteransi');

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
  let skeletonDirectory;

  try {
    skeletonDirectory = await _skeletonDir(supplier);
  } catch (e) {
    error(e.message);
    return;
  }

  const {
    questions,
    prependTransforms,
    appendTransforms,
    before,
    after} = await _skeletonConfig(skeletonDirectory);

  if (!here) {
    // ensure target folder is available
    const namePrompt = questions.find(q => q.name === 'name');
    const oldValidate = namePrompt.validate;
    namePrompt.validate = async value => {
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
    // 1. turn on silent mode (unattended).
    // 2. alter preselectedFeatures.
    // 3. alter predefinedProperties
    // "before" task should also respect existing silent mode (unattended).
    if (result.hasOwnProperty('unattended')) {
      unattended = result.unattended;
    }

    if (result.hasOwnProperty('preselectedFeatures')) {
      preselectedFeatures = result.preselectedFeatures;
    }

    if (result.hasOwnProperty('predefinedProperties')) {
      predefinedProperties = result.predefinedProperties;
    }
  }

  const [properties, features, notDefaultFeatures] = await _runQuestionnaire(questions, {
    unattended,
    preselectedFeatures,
    predefinedProperties
  });

  if (!properties.name) {
    throw new Error('Unexpected missing project name.');
  }

  const targetDir = here ? '.' : properties.name;
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
module.exports = makes;

