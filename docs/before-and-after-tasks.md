---
layout: default
title: '"before" and "after" tasks'
nav_order: 11
description: Learn how to add "before" and "after" tasks
permalink: /before-and-after-tasks
---

# "before" and "after" tasks
{: .no_toc }

1. TOC
{:toc}

## "makes" work flow

The whole [work flow](https://github.com/makesjs/makes/blob/master/lib/index.js) is not complex.

1. download skeleton.
2. read skeleton optional files `questions.js`, `transforms.js`, `before.js`, and `after.js`.
3. runs optional "before" task defined by `before.js`.
4. run through questions, gather [`properties` and `features`](questions/features-and-properties).
5. write out project.
6. runs optional "after" task defined by `after.js`.

## "after" task

We start with the more common "after" task.

"after" task happens after "makes" finished writing out project.

For example you can follow up in a JavaScript project to install npm dependencies.

The [`dumberjs/new` `after.js`](https://github.com/dumberjs/new/blob/master/after.js) is a great example.

```js
const {execSync} = require('child_process');

function isAvailable(bin) {
  try {
    execSync(bin + ' -v')
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async function({
  unattended, here, prompts, run, properties, features, notDefaultFeatures, ansiColors
}) {
  if (unattended) return;

  const choices = [
    {title: 'No'},
    {value: 'npm', title: 'Yes, use npm'}
  ];

  if (isAvailable('yarn')) {
    choices.push({value: 'yarn', title: 'Yes, use yarn'});
  }

  if (isAvailable('pnpm')) {
    choices.push({value: 'pnpm', title: 'Yes, use pnpm'});
  }

  const result = await prompts.select({
    message: 'Do you want to install npm dependencies now?',
    choices
  });

  if (result) {
    await run(result, ['install']);
  }

  const c = ansiColors;
  console.log(`\nNext time, you can try to create similar project in silent mode:`);
  console.log(c.inverse(` npx makes dumberjs new-project-name${here ? ' --here' : ''} -s ${notDefaultFeatures.length ? (notDefaultFeatures.join(',') + ' ') : ''}`));
};
```

You define a function in `after.js`.

1. the single input argument has following fields:
  * `unattended` is true when in silent mode.
  * `here` is true when in here mode.
  * `features` is the selected features array from select prompts.
  * `notDefaultFeatures` is a sub-set of `features` array, only contains non-default choices. You can use this array to construct a clear silent mode command, as the above example showed.
  * `properties` is the `properties` hash object from text prompts.
  * `prompts` is the exposed "makes" inner prompts implementation. You can call `prompts.text(opts)` and `prompts.select(opts)` to ask user questions.
  * `ansiColors` is the exposed ["ansi-colors" npm package](https://www.npmjs.com/package/ansi-colors). This is provided for skeleton to avoid some runtime dependencies.
  * `sisteransi` is the exposed ["sisteransi" npm package](https://www.npmjs.com/package/sisteransi). This is provided for skeleton to avoid some runtime dependencies.
  * `run(cmd, args)` is a convenient function to run command. It runs the command with optional arguments in final project folder. The above example shows `run('npm', ['install'])`.
2. the result value is ignored. But "after" task can be async (returns a promise).

## "before" task

The optional "before" task happens right before prompting questions, it can:

1. turn on/off silent mode (aka unattended).
2. alter preselectedFeatures.
3. alter predefinedProperties.
4. or maybe just print out some greetings.

"before" task should also respect existing silent mode (aka unattended).

You define a function in `before.js`.

1. the single input argument has following fields:
  * `unattended` is true when in silent mode.
  * `here` is true when in here mode.
  * `preselectedFeatures` is the pre-selected features array from optional command line switch `-s x,y,z`, default to an empty array.
  * `predefinedProperties` is the pre-defined properties hash object gathered from command line, default to an empty object.
  * `prompts` is the exposed "makes" inner prompts implementation. You can call `prompts.text(opts)` and `prompts.select(opts)` to ask user questions.
  * `ansiColors` is the exposed ["ansi-colors" npm package](https://www.npmjs.com/package/ansi-colors). This is provided for skeleton to avoid some runtime dependencies.
  * `sisteransi` is the exposed ["sisteransi" npm package](https://www.npmjs.com/package/sisteransi). This is provided for skeleton to avoid some runtime dependencies.
2. "before" task can be async (returns a promise). The result value is optional, but when you return a value object, it can have following optional fields:
  * `unattended`, you can return `{unattended: true}` to turn on silent mode, or `{unattended: false}` to turn off silent mode.
  * `preselectedFeatures`, you can replace `preselectedFeatures` array.
  * `predefinedProperties`, you can replace `predefinedProperties` hash object.

When you overwrite `unattended`, `preselectedFeatures`, or `predefinedProperties`, it alters the behaviour of question prompts.

For example, aurelia/new skeleton use "before" task to ask user to:
1. pick a preset (turn on silent mode, plus preset `preselectedFeatures`).
2. or use custom mode (overwrite nothing, run through questions interactively).

TODO: add example from future aurelia skeleton how to use "before" task
