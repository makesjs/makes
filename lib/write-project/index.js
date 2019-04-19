const src = require('./src');
const dest = require('./dest');
const path = require('path');

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
  // costom transform stream provided by user
  prependTransforms = [],
  appendTransforms = []
}) {
  // Folder "common" is the base template folder
  const folders = ['common', ...features].map(f => path.join(skeletonDir, f));

  let s = src(folders);

  const params = [properties, features, targetDir, unattended];
  prependTransforms.forEach(t => s = s.pipe(t(...params)));

  s = s.pipe(wrap(_1_markWritePolicy))
    .pipe(wrap(   _2_filterByFeatures(features)))
    .pipe(wrap(   _3_preprocess(properties, features)))
    .pipe(        _4_mergeFiles());

  appendTransforms.forEach(t => s = s.pipe(t(...params)));

  s = s.pipe(whenFileExists(targetDir, unattended))
    .pipe(dest(targetDir));

  return new Promise((resolve, reject) => {
    s.once('error', reject);
    s.once('finish', resolve);
  });
};
