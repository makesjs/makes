/* eslint-disable no-console */
const mri = require('mri');
const camelCase = require('lodash.camelcase');

module.exports = function(argv, help = '') {
  const options = mri(argv, {
    alias: {s: 'select', h: 'help'},
    string: ['select'],
    boolean: ['help', 'here'],
    default: {
      help: false,
      here: false
    }
  });

  if (options.help) {
    console.log(help);
    process.exit();
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
    if (k === '_' ||
        k === 's' ||
        k === 'select' ||
        k === 'here' ||
        k === 'h' ||
        k === 'help') return;
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

  const unattended = options.hasOwnProperty('s');

  return {
    supplier,
    predefinedProperties,
    preselectedFeatures,
    unattended,
    here
  };
};
