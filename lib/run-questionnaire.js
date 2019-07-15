const {select, text} = require('./prompts');
const applicable = require('./applicable');
const SoftError = require('./soft-error');

function isSame(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (!arr1 && !arr2) return true;
  if (!arr1 && !arr2.length) return true;
  if (!arr2 && !arr1.length) return true;

  if (arr1.length !== arr2.length) return false;
  for (let i = 0, ii = arr1.length; i < ii; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// Get user provided predefinedProperties, preselectedFeatures, go through all the questions,
// Output a cleaned up features.
//
// _debug is used to pass in answers for prompts.
async function run(questions, {
  unattended = false,
  preselectedFeatures = [],
  predefinedProperties = {},
  _debug = []
}) {
  const pickedFeatures = [];
  const properties = {};
  // a subset of pickedFeatures, only for "after" task
  // For example "after" task can print out a summary including how to use
  // silent mode to repeat scaffolding.
  const notDefaultFeatures = [];

  async function ask(question) {
    let {choices, name} = question;

    if (!name && !choices) {
      throw new SoftError(`Question needs to supply "choices" for selection, or "name" for text prompt. Invalid question:\n` +
        JSON.stringify(question, null, 2) + '\n\n');
    }

    if (name && choices) {
      // only text prompt needs name
      name = null;
    }

    if (!name && !Array.isArray(choices)) {
      throw new SoftError(`"choices" for select prompt must be an array. Invalid question:\n` +
        JSON.stringify(question, null, 2) + '\n\n');
    }

    // Conditional question.
    // check ./applicable.js for acceptable expression
    if (question.if && !applicable(pickedFeatures, question.if)) {
      return;
    }

    if (name) {
      // text
      properties[name] = await textPrompt(question, {unattended, predefinedProperties, _debug});
    } else {
      const choices = question.choices.filter(c => !c.if || applicable(pickedFeatures, c.if));
      const defaultValue = question.multiple ?
        choices.filter(c => c.selected).map(c => c.value) :
        choices[0].value;
      // select or multiselect
      const picked = await selectPrompt(question, pickedFeatures, {preselectedFeatures, unattended, _debug});

      if (question.multiple) {
        if (picked && picked.length) {
          picked.forEach(p => pickedFeatures.push(p));
        }

        if (!isSame(picked, defaultValue) && picked.length) {
          picked.forEach(p => notDefaultFeatures.push(p));
        }
      } else {
        if (picked) pickedFeatures.push(picked);
        if (picked && picked !== defaultValue) notDefaultFeatures.push(picked);
      }
    }
  }

  for (let i = 0, ii = questions.length; i < ii; i++) {
    await ask(questions[i]);
  }

  return [properties, pickedFeatures, notDefaultFeatures];
}

async function textPrompt(question, {predefinedProperties, unattended, _debug}) {
  const {name} = question;
  if (!name.match(/^[a-zA-Z1-9-]+$/)) {
    throw new SoftError(`Name ${JSON.stringify(name)} is invalid. Only accept letters, numbers, and dash(-).\n` +
      'In question:\n' + JSON.stringify(question, null, 2) + '\n\n');
  }

  let answer;
  if (predefinedProperties[name]) {
    answer = predefinedProperties[name];
  } else if (unattended) {
    answer = question.default || '';
  } else if (_debug && _debug.length) {
    answer = _debug.shift();
  } else {
    answer = await text(question);
  }

  if (question.validate) {
    const valid = await question.validate.call(undefined, answer);
    // simulate same error in predefined/unattended mode
    if (typeof valid === 'string' && valid) {
      throw new SoftError(`Invalid "${name}": ${valid}`);
    } else if (valid === false) {
      throw new SoftError(`Invalid value in "${name}".`);
    }
  }
  return answer;
}

const RESERVED_VALUES = ['and', 'or', 'not', 'true', 'false'];

async function selectPrompt(question, pickedFeatures, {preselectedFeatures, unattended, _debug}) {
  let {choices, multiple} = question;

  choices.forEach(c => {
    if (multiple && !c.value) {
      throw new SoftError(`Value ${JSON.stringify(c.value)} is invalid. Need to provide a non-empty string value for every choice in multi-select.\n` +
        'In question:\n' + JSON.stringify(question, null, 2) + '\n\n');
    }

    if (c.value && (typeof c.value !== 'string' || !c.value.match(/^[a-zA-Z1-9-]*$/))) {
      throw new SoftError(`Value ${JSON.stringify(c.value)} is invalid. Only accept letters, numbers, and dash(-).\n` +
        'In question:\n' + JSON.stringify(question, null, 2) + '\n\n');
    }

    if (RESERVED_VALUES.includes(c.value)) {
      throw new SoftError(`Value ${JSON.stringify(c.value)} is rejected, because it's one of reserved strings ${JSON.stringify(RESERVED_VALUES)}.\n` +
        'In question:\n' + JSON.stringify(question, null, 2) + '\n\n');
    }
  });

  // Conditional choices
  // {value: 'foo', message: 'Foo', hint: 'lorem', if: 'webpack && typescript'}
  choices = choices.filter(c => !c.if || applicable(pickedFeatures, c.if));

  // not applicable at all
  if (choices.length === 0) return;
  // only one choice for single-select, don't have to raise the question
  if (choices.length === 1 && !multiple) {
    return choices[0].value;
  }

  // find the last match, in order to allow user to overwrite
  let selected;
  let matchingIndex;
  const multiselected = [];
  choices.forEach(c => {
    // skip empty value
    if (!c.value) return;
    const idx = preselectedFeatures.indexOf(c.value);
    if (idx === -1) return;
    if (multiple) {
      multiselected.push(c.value);
    } else {
      if (matchingIndex === undefined || matchingIndex < idx) {
        matchingIndex = idx;
        selected = c.value;
      }
    }
  });

  if (multiple && multiselected.length) {
    return multiselected;
  }

  if (!multiple && selected) {
    return selected;
  }

  // Pick default answer in unattended mode
  if (unattended) {
    if (multiple) {
      const selected = choices.filter(c => c.selected).map(c => c.value);
      if (selected.length) {
        return selected;
      }
      return;
    }
    return choices[0].value;
  }

  // choice index is 1-based.
  if (_debug && _debug.length) {
    let idx = _debug.shift();
    if (idx) {
      if (multiple) {
        return idx.map(i => choices[i - 1].value);
      }
      return choices[idx - 1].value;
    }
  }

  return await select({...question, choices});
}

run.textPrompt = textPrompt;
run.selectPrompt = selectPrompt;
module.exports = run;
