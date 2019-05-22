const {select, multiselect, text} = require('./prompts');
const applicable = require('./applicable');

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

  async function ask(question) {
    let {choices, name} = question;

    if (!name && !choices) {
      throw new Error(`Question needs to supply "choices" for selection, or "name" for text prompt. Invalid question:\n` +
        JSON.stringify(question, null, 2) + '\n\n');
    }

    if (name && choices) {
      // only text prompt needs name
      name = null;
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
      // select or multiselect
      await selectPrompt(question, pickedFeatures, {preselectedFeatures, unattended, _debug});
    }
  }

  for (let i = 0, ii = questions.length; i < ii; i++) {
    await ask(questions[i]);
  }

  return [properties, pickedFeatures];
}

async function textPrompt(question, {predefinedProperties, unattended, _debug}) {
  const {name} = question;
  if (!name.match(/^[a-zA-Z1-9-]+$/)) {
    throw new Error(`Name ${JSON.stringify(name)} is invalid. Only accept letters, numbers, and dash(-).` +
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
      throw new Error(`Invalid "${name}": ${valid}`);
    } else if (valid === false) {
      throw new Error(`Invalid value in "${name}".`);
    }
  }
  return answer;
}

const RESERVED_VALUES = ['and', 'or', 'not', 'true', 'false'];

async function selectPrompt(question, pickedFeatures, {preselectedFeatures, unattended, _debug}) {
  let {choices, multiple} = question;

  choices.forEach(c => {
    if (c.value && (typeof c.value !== 'string' || !c.value.match(/^[a-zA-Z1-9-]*$/))) {
      throw new Error(`Value ${JSON.stringify(c.value)} is invalid. Only accept letters, numbers, and dash(-).\n` +
        'In question:\n' + JSON.stringify(question, null, 2) + '\n\n');
    }

    if (RESERVED_VALUES.includes(c.value)) {
      throw new Error(`Value ${JSON.stringify(c.value)} is rejected, because it's one of reserved strings ${JSON.stringify(RESERVED_VALUES)}.\n` +
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
    if (choices[0].value) pickedFeatures.push(choices[0].value);
    return;
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
    multiselected.forEach(s => s && pickedFeatures.push(s));
    return;
  }

  if (!multiple && selected) {
    if (selected) pickedFeatures.push(selected);
    return;
  }

  // Pick default answer in unattended mode
  if (unattended) {
    if (multiple) {
      const selected = choices.filter(c => c.selected).map(c => c.value);
      if (selected.length) {
        selected.forEach(s => pickedFeatures.push(s));
      }
    } else {
      const first = (choices[0].value || '').trim();
      if (first) pickedFeatures.push(first);
    }
    return;
  }

  // choice index is 1-based.
  if (_debug && _debug.length) {
    let idx = _debug.shift();
    if (idx) {
      if (multiple) {
        idx.forEach(i => {
          const debugPicked = choices[i - 1].value;
          if (debugPicked) pickedFeatures.push(debugPicked);
        });
      } else {
        const debugPicked = choices[idx - 1].value;
        if (debugPicked) pickedFeatures.push(debugPicked);
      }
      return;
    }
  }

  if (multiple) {
    const picked = await multiselect({...question, choices});
    if (picked && picked.length) {
      picked.forEach(p => pickedFeatures.push(p));
    }
  } else {
    const picked = await select({...question, choices});
    if (picked) pickedFeatures.push(picked);
  }
}

run.textPrompt = textPrompt;
run.selectPrompt = selectPrompt;
module.exports = run;
