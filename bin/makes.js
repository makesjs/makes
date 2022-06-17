#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
const meta = fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8');
const { version } = JSON.parse(meta);
const help = fs.readFileSync(new URL('./help.txt', import.meta.url), 'utf8');

let makes;
if (process.env.MAKES_RUN_SRC) {
  // only for local source debug
  makes = (await import('../lib/index.js'));
} else {
  // for production
  makes = (await import('../dist/index.js'));
}

console.log(`makes v${version} https://makes.js.org`);

const {
  supplier,
  predefinedProperties,
  preselectedFeatures,
  unattended,
  here
} = makes.getOpts(process.argv.slice(2), help);

try {
  await makes.default(supplier, {
    predefinedProperties,
    preselectedFeatures,
    unattended,
    here
  });
} catch(e) {
  if (e.name === 'SoftError') {
    console.error(e.message);
  } else {
    console.error(e);
  }
  process.exit(1);
}
