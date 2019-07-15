#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';
const fs = require('fs');
const path = require('path');
const help = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8');

let makes;
try {
  // only for local source debug
  makes = require('../lib');
} catch (e) {
  // for production
  makes = require('../dist');
}

const {version} = require('../package.json');
console.log(`makes v${version}`);

const {
  supplier,
  predefinedProperties,
  preselectedFeatures,
  unattended,
  here
} = makes.getOpts(process.argv.slice(2), help);

makes(supplier, {
  predefinedProperties,
  preselectedFeatures,
  unattended,
  here
}).catch(error => {
  if (error.name === 'SoftError') {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
