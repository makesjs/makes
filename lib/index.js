const writeProject = require('./write-project');
const skeletonDir = require('./skeleton-dir');
const config = require('./skeleton-config');
const run = require('./run-questionnaire');
const {error} = require('./log');

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

  const [properties, features] = await run(questions, {
    unattended,
    preselectedFeatures,
    predefinedProperties
  });

  if (!properties.name) {
    error('Unexpected missing project name.');
    return;
  }

  writeProject({
    properties,
    features,
    skeletonDir: skeletonDirectory,
    targetDir: here ? '.' : properties.name,
    unattended,
    prependTransforms,
    appendTransforms
  });
};
