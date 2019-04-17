#!/user/bin/env node
'use strict';

const makes = require('../lib');
const getopts = require("getopts");
const options = getopts(process.argv.slice(2), {alias: {s: 'select', h: 'here'}});

if (options._.length < 1) {
  console.error('Please provide a skeleton repo. For instance "npx makes dumberjs"');
  process.exit(1);
}

if (options._.length > 2) {
  console.warn(`Skip unknown arguments: "${options._.slice(2).join(' ')}"`);
}

const supplier = options._[0];
const here = options.h;

let predefinedProperties = Object.create(null);
if (options._.length > 1) {
  // projectName
  predefinedProperties.name = options._[1];
}

Object.keys(options).forEach(k => {
  if (k === '_' || k === 's' || k === 'select') return;
  predefinedProperties[k] = options[k];
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
