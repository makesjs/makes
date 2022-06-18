import src from './src.js';
import dest from './dest.js';
import path from 'path';
import {pipeline} from 'stream/promises';
import * as prompts from '../prompts/index.js';

import _1_markWritePolicy from './1-mark-write-policy.js';
import _2_filterByFeatures from './2-filter-by-features.js';
import _3_preprocess from './3-preprocess.js';
import _4_mergeFiles from './4-merge-files.js';
import wrap from './wrap-transform.js';
import whenFileExists from './when-file-exists.js';

export default function({
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
}
