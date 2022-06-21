const src = require('./src');
const dest = require('./dest');
const path = require('path');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline);
const prompts = require('../prompts');

const _1_markWritePolicy = require('./1-mark-write-policy');
const _2_filterByFeatures = require('./2-filter-by-features');
const _3_preprocess = require('./3-preprocess');
const _4_mergeFiles = require('./4-merge-files');
const wrap = require('./wrap-transform');
const whenFileExists = require('./when-file-exists');

module.exports = function({
  properties,
  features,
  skeletonDir,
  targetDir,
  unattended,
  // custom transform stream provided by user
  prependTransforms = [],
  appendTransforms = []
}) {
  // Folder "common" is the base template folder
  const folders = ['common', ...features].map(f => path.join(skeletonDir, f));
  const params = [properties, features, targetDir, unattended, prompts];

  return pipeline(
    src(folders),

    ...prependTransforms.map(t => t(...params)),

    wrap(_1_markWritePolicy),
    wrap(_2_filterByFeatures(features)),
    wrap(_3_preprocess(properties, features)),
    _4_mergeFiles(),

    ...appendTransforms.map(t => t(...params)),

    whenFileExists(targetDir, unattended),
    dest(targetDir)
  );
};
