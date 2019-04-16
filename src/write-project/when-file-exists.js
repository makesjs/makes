import fs from 'fs';
import path from 'path';
import through2 from 'through2';
import _ from 'lodash';
import {select} from '../prompts';

export default function(targetFolder, unattended, _mockAsk) {
  const _ask = _mockAsk || askQuestion;

  function exists(relativePath) {
    try {
      const stats = fs.statSync(path.join(targetFolder, relativePath));
      return stats.isFile();
    } catch (e) {
      return false;
    }
  }

  return through2.obj((file, enc, cb) => {
    if (file.isBuffer() && exists(file.relative)) {
      if (file.relative.match(/readme(\.(md|txt|markdown))?$/i)) {
        // Special treatment for readme file, use append by default
        if (!file.writePolicy) file.writePolicy = 'append';
      } else if (file.relative === 'package.json') {
        // Special treatment for package.json file
        if (file.writePolicy) file.writePolicy = null;
        // Merge dependencies to existing package.json
        const packageJson = JSON.parse(fs.readFileSync(path.join(targetFolder, 'package.json'), 'utf8'));
        const newJson = JSON.parse(file.contents.toString('utf8'));
        const deps = _.pick(newJson, 'dependencies', 'devDependencies', 'peerDependencies');
        _.merge(packageJson, deps);
        file.contents = Buffer.from(JSON.stringify(packageJson, null, 2));
      } else if (file.writePolicy === 'ask') {
        let ask = unattended ? Promise.resolve(false) : _ask(file.relative);
        ask.then(toReplace => {
          // Unset write policy
          file.writePolicy = null;
          if (toReplace) {
            console.warn(`Overwrites existing file '${file.relative}' with a new one designed.`);
          } else {
            const oldRelative = file.relative;
            file.basename = file.basename + '__makes';
            console.warn(`Keeps existing file '${oldRelative}'. New file '${file.relative}' is created. You may need to update existing contents.`);
          }
          cb(null, file);
        });
        return;
      }
    }

    cb(null, file);
  });
}

async function askQuestion(relativePath) {
  const decision = await select({
    message: `An existing file named '${relativePath}' was found. What would you like to do?`,
    choices: [{
      value: 'keep',
      title: 'Keep the existing file',
      hint: `Keeps your existing file. New file will be created as '${relativePath}__makes'. You may need to update existing contents to work.`
    }, {
      value: 'replace',
      title: 'Replace the existing file ',
      hint: 'Replaces the existing file with a new one designed.'
    }]
  });

  return decision === 'replace';
}