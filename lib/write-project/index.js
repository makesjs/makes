const {src, dest} = require('vinyl-fs');
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
  // Note: have to use /**/* on windows, because \**\* doesn't work as expected.
  const globs = ['common', ...features].map(f =>
    path.join(skeletonDir, f, '**', '*').replace(/\\/g, '/')
  );

  // Include dot files, skip empty folders.
  let s = src(globs, {dot: true, nodir: true});

  const params = [properties, features, targetDir, unattended];
  prependTransforms.forEach(t => s = s.pipe(t(...params)));

  s = s.pipe(wrap(_1_markWritePolicy))
    .pipe(wrap(   _2_filterByFeatures(features)))
    .pipe(wrap(   _3_preprocess(properties, features)))
    .pipe(        _4_mergeFiles());

  appendTransforms.forEach(t => s = s.pipe(t(...params)));

  return s.pipe(whenFileExists(targetDir, unattended))
    .pipe(dest(targetDir, {
      overwrite: file => file.writePolicy !== 'skip',
      append: file => file.writePolicy === 'append',
      mode: parseInt('644', 8) // make sure files are writeable
    }));
};
