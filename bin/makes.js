#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const makes = require('../dist');
const minimist = require('minimist');
const camelCase = require('lodash.camelcase');
const options = minimist(process.argv.slice(2), {
  alias: {s: 'select', h: 'here'},
  string: ['select'],
  boolean: ['help', 'here']
});

if (options.help) {
  console.log(`USAGE: makes [--help] [-h | --here] [-s | --select=<feature1,feature2>]
             <skeleton-repo> [<project-name>]

OPTIONS
  --help        Print this help page.

  -h, --here    Generate project in current folder, otherwise in folder
                project-name.

  -s, --select  Preselect features (provided by skeleton repo). This also
                turns on silent mode without any prompting.

ARGUMENTS
  skeleton-repo Support hosted git repo from github/bitbucket/gitlab.
                  username/repo
                    -> github:username/repo#master
                  username/repo#tag-or-branch-or-commit
                    -> github:username/repo#tag-or-branch-or-commit
                  bitbucket:username/repo
                    -> bitbucket:username/repo#master
                  gitlab:username/repo#ref
                    -> gitlab:username/repo#ref

                makes supports the conventional "new" repo.
                  username
                    -> github:username/new#master
                  bitbucket:username
                    -> bitbucket:username/new#master
                  gitlab:username
                    -> gitlab:username/new#master

  project-name  Optional project name. If not provided, there will be a
                prompt asking user to provide project name.
                In silent mode, unprovided project-name will default to
                "my-app" unless the skeleton repo provided a different
                default value.
EXAMPLES
  npx makes dumberjs
  npx makes dumberjs my-awesome-app
  npx makes your-github-username/your-skeleton-repo#ref
`);
  process.exit(0);
}

if (options._.length < 1) {
  console.error('Please provide a skeleton repo. For instance "npx makes dumberjs"');
  process.exit(1);
}

if (options._.length > 2) {
  console.warn(`Skip unknown arguments: "${options._.slice(2).join(' ')}"`);
}

const supplier = options._[0];
const here = options.here;

let predefinedProperties = Object.create(null);
if (options._.length > 1) {
  // projectName
  predefinedProperties.name = options._[1];
}

Object.keys(options).forEach(k => {
  if (k === '_' || k === 's' || k === 'select') return;
  // for --some-name 'Lorem ipsum' or --some-name='Lorem ipsum'
  // add property 'some-name' and 'someName'
  predefinedProperties[k] = options[k];
  const ck = camelCase(k);
  if (ck !== k) {
    predefinedProperties[ck] = options[k];
  }
});

let preselectedFeatures = [];
if (options.s) {
  preselectedFeatures = options.s.split(/,|:| /);
}

const unattended = preselectedFeatures.length > 0;

makes(supplier, {
  predefinedProperties,
  preselectedFeatures,
  unattended,
  here
});
