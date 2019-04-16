import {src, dest} from 'vinyl-fs';
import path from 'path';

import _1_markWritePolicy from './1-mark-write-policy';
import _2_filterByFeatures from './2-filter-by-features';
import _3_preprocess from './3-preprocess';
import _4_mergeFiles from './4-merge-files';
import wrap from './wrap-transform';
import whenFileExists from './when-file-exists';

export default function({
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
}
