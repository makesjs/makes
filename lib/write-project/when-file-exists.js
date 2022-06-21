const fs = require('fs');
const path = require('path');
const {Transform} = require('stream');
const {select} = require('../prompts');
const {fileExists} = require('../file-exists');
const {warn} = require('../log');

function updateField(target, source, field) {
  if (source[field]) {
    if (target[field]) {
      Object.assign(target[field], source[field]);
    } else {
      target[field] = source[field];
    }
  }
}

module.exports = function(targetFolder, unattended, _mockAsk) {
  const _ask = _mockAsk || askQuestion;

  return new Transform({
    objectMode: true,
    transform: (file, enc, cb) => {
      if (file.isBuffer() && fileExists(path.join(targetFolder, file.relative))) {
        if (file.relative.match(/readme(\.(md|txt|markdown))?$/i)) {
          // Special treatment for readme file, use append by default
          if (!file.writePolicy) file.writePolicy = 'append';
        }

        if (file.relative === 'package.json') {
          // Special treatment for package.json file
          if (file.writePolicy) file.writePolicy = null;
          // Merge dependencies to existing package.json
          const packageJson = JSON.parse(fs.readFileSync(path.join(targetFolder, 'package.json'), 'utf8'));
          const newJson = JSON.parse(file.contents.toString('utf8'));
          ['dependencies', 'devDependencies', 'peerDependencies'].forEach(field =>
            updateField(packageJson, newJson, field)
          );
          file.contents = Buffer.from(JSON.stringify(packageJson, null, 2));
        } else if (file.writePolicy === 'ask') {
          let ask = unattended ? Promise.resolve(false) : _ask(file.relative);
          ask.then(toReplace => {
            // Unset write policy
            file.writePolicy = null;
            if (toReplace) {
              warn(`Overwrites existing file '${file.relative}' with a new one designed.`);
            } else {
              const oldRelative = file.relative;
              file.basename = file.basename + '__makes';
              warn(`Keeps existing file '${oldRelative}'. New file '${file.relative}' is created. You may need to update existing contents.`);
            }
            cb(null, file);
          });
          return;
        } else if (file.writePolicy === 'skip') {
          // skip the file
          cb();
          return;
        }
      }

      cb(null, file);
    }
  });
};

/* istanbul ignore next */
async function askQuestion(relativePath) {
  const decision = await select({
    message: `An existing file named '${relativePath}' was found. What would you like to do?`,
    choices: [{
      value: 'keep',
      title: 'Keep the existing file',
      hint: `Keeps your existing file. New file will be created as '${relativePath}__makes'. You may need to update existing contents to work.`
    }, {
      value: 'replace',
      title: 'Replace the existing file',
      hint: 'Replaces the existing file with a new one designed.'
    }]
  });

  return decision === 'replace';
}
