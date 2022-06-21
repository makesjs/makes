#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');
const help = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8');

let makes;
if (process.env.MAKES_RUN_SRC) {
  // only for local source debug
  makes = require('../lib/index.js');
} else {
  // for production
  makes = require('../dist/index.js');
}

console.log(`makes v${version} https://makes.js.org`);

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
}).catch(e => {
  if (e.name === 'SoftError') {
    console.error(e.message);
  } else {
    console.error(e);
  }
  process.exit(1);
});
