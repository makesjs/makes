const writeProject = require('./write-project');
const skeletonDir = require('./skeleton-dir');
const config = require('./skeleton-config');
const run = require('./run-questionnaire');
const {info, error} = require('./log');
const fs = require('fs');

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

module.exports = async function(supplier, {
  predefinedProperties = {},
  preselectedFeatures = [],
  unattended = false,
  here = false
}) {
  let skeletonDirectory;

  try {
    skeletonDirectory = await skeletonDir(supplier);
  } catch (e) {
    error(e.message);
    return;
  }

  const {
    questions,
    prependTransforms,
    appendTransforms} = await config(skeletonDirectory);

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

  const [properties, features] = await run(questions, {
    unattended,
    preselectedFeatures,
    predefinedProperties
  });

  if (!properties.name) {
    throw new Error('Unexpected missing project name.');
  }

  await writeProject({
    properties,
    features,
    skeletonDir: skeletonDirectory,
    targetDir: here ? '.' : properties.name,
    unattended,
    prependTransforms,
    appendTransforms
  });

  info(`Project ${properties.name} has been created.`);
};
