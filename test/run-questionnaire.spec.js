const test = require('ava');
const {Readable, Writable} = require('stream');
const {pressKeys} = require('./prompts/_prompt-under-test');
const run = require('../lib/run-questionnaire');
const {textPrompt, selectPrompt} = run;

test('textPrompt rejects invalid name', async t => {
  await t.throwsAsync(async () => textPrompt({name: 'a&b'}, {predefinedProperties: {}}));
  await t.throwsAsync(async () => textPrompt({name: 'a b'}, {predefinedProperties: {}}));
});

test('textPrompt returns predefined value without prompting', async t => {
  const value = await textPrompt({name: 'lorem'}, {predefinedProperties: {lorem: 'foo'}});
  t.is(value, 'foo');
});

test('textPrompt returns predefined value in unattended mode without prompting', async t => {
  const value = await textPrompt({name: 'lorem', default: 'bar'}, {predefinedProperties: {lorem: 'foo'}, unattended: true});
  t.is(value, 'foo');
});

test('textPrompt rejects invalid predefined value in unattended mode without prompting', async t => {
  await t.throwsAsync(async () => textPrompt({
    name: 'lorem',
    default: 'bar',
    validate: v => !!v.match(/^[a-z]+$/),
  }, {predefinedProperties: {lorem: '123'}, unattended: true}), {
    message: /Invalid value in "lorem"/
  });
});

test('textPrompt rejects invalid predefined value with error message in unattended mode without prompting', async t => {
  await t.throwsAsync(async () => textPrompt({
    name: 'lorem',
    default: 'bar',
    validate: v => {
      if (!v.match(/^[a-z]+$/)) {
        return 'only accept letters';
      }
    }
  }, {predefinedProperties: {lorem: '123'}, unattended: true}), {
    message: /only accept letters/
  });
});

test('textPrompt returns default value in unattended mode without prompting', async t => {
  const value = await textPrompt({name: 'lorem', default: 'bar'}, {predefinedProperties: {}, unattended: true});
  t.is(value, 'bar');
});

test('textPrompt prompts for user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, ['a', 'b', 'c', {name: 'return'}]);

  const value = await textPrompt({
    name: 'lorem',
    message: 'lorem',
    default: 'bar',
    in: debugIn,
    out: nullOut
  }, {predefinedProperties: {}});

  t.is(value, 'abc');
});

test('textPrompt validates user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, ['a', 'b', '1', {name: 'return'}, {name: 'backspace'}, 'c', {name: 'return'}]);

  const value = await textPrompt({
    name: 'lorem',
    message: 'lorem',
    validate: v => !!v.match(/^[a-z]+$/),
    default: 'bar',
    in: debugIn,
    out: nullOut
  }, {predefinedProperties: {}});

  t.is(value, 'abc');
});

test('selectPrompt rejects invalid choice value', async t => {
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'a&b'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'a b'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'and'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'or'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'not'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'true'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'false'}]}, [], {preselectedFeatures: []}));
});

test('selectPrompt returns value of the only choice without prompting', async t => {
  const picked = await selectPrompt({choices:[{value:'a'}]}, [], {preselectedFeatures: []});
  t.is(picked, 'a');
});

test('selectPrompt ignores empty value without prompting', async t => {
  const picked = await selectPrompt({choices:[{}]}, [], {preselectedFeatures: []});
  t.is(picked, undefined);
});

test('selectPrompt returns preselected without prompting', async t => {
  const picked = await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: ['b']});
  t.is(picked, 'b');
});

test('selectPrompt cleans up conflicted preselected without prompting', async t => {
  const picked = await selectPrompt({choices:[{}, {value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: ['b', 'a']});
  t.is(picked, 'a');
});

test('selectPrompt returns first choice in unattended mode without prompting', async t => {
  const picked = await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: [], unattended: true});
  t.is(picked, 'a');
});

test('selectPrompt still returns preselected in unattended mode without prompting', async t => {
  const picked = await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: ['b'], unattended: true});
  t.is(picked, 'b');
});

test('selectPrompt prompts for user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, [{name: 'down'}, {name: 'return'}]);

  const picked = await selectPrompt({
    choices:[{value: 'a'}, {value: 'b'}, {value: 'c'}],
    in: debugIn,
    out: nullOut
  }, [], {preselectedFeatures: []});

  t.is(picked, 'b');
});

test('selectPrompt (multiselect) returns preselected without prompting', async t => {
  const picked = await selectPrompt({multiple: true, choices:[{value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: ['b']});
  t.deepEqual(picked, ['b']);
});

test('selectPrompt (multiselect) returns empty list in unattended mode without prompting', async t => {
  const picked = await selectPrompt({multiple: true, choices:[{value: 'a'}, {value: 'b'}]}, [], {preselectedFeatures: [], unattended: true});
  t.is(picked, undefined);
});

test('selectPrompt (multiselect) still returns preselected in unattended mode without prompting', async t => {
  const picked = await selectPrompt({multiple: true, choices:[{value: 'a', selected: true}, {value: 'b'}]}, [], {preselectedFeatures: ['b'], unattended: true});
  t.deepEqual(picked, ['b']);
});

test('selectPrompt (multiselect) returns default selected in unattended mode without prompting', async t => {
  const picked = await selectPrompt({multiple: true, choices:[{value: 'a', selected: true}, {value: 'b'}]}, [], {preselectedFeatures: [], unattended: true});
  t.deepEqual(picked, ['a']);
});

test('selectPrompt (multiselect) prompts for user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, [{name: 'down'}, ' ', {name: 'return'}]);

  const picked = await selectPrompt({
    multiple: true,
    choices:[{value: 'a'}, {value: 'b'}, {value: 'c', selected: true}],
    in: debugIn,
    out: nullOut
  }, [], {preselectedFeatures: []});

  t.deepEqual(picked, ['b', 'c']);
});

test('selectPrompt supports conditional choice', async t => {
  const picked = await selectPrompt({choices:[{value: 'a', if: '!w'}, {value: 'b', if: 'w'}]}, ['w'], {preselectedFeatures: []});
  t.deepEqual(picked, 'b');
  const picked2 = await selectPrompt({choices:[{value: 'c', if: '!w'}, {value: 'd', if: 'w'}, {value: 'e'}]}, ['w'], {preselectedFeatures: [], _debug: [1]});
  t.deepEqual(picked2, 'd');
});

test('selectPrompt skip empty choices after condition', async t => {
  const picked = await selectPrompt({choices:[{value: 'a', if: '!w'}, {value: 'b', if: '!w'}]}, ['w'], {preselectedFeatures: []});
  t.is(picked, undefined);
});

test('selectPrompt (multiselect) supports conditional choice', async t => {
  const picked = await selectPrompt({multiple: true, choices:[{value: 'c', if: '!w'}, {value: 'd', if: 'w'}, {value: 'e'}]}, ['w'], {preselectedFeatures: ['b'], _debug: [[1,2]]});
  t.deepEqual(picked, ['d', 'e']);
});

const questions = [
  {
    name: 'name',
    message: '',
    default: 'my-app'
  },
  {
    choices: [{value: 'webpack'}, {value: 'dumber'}]
  },
  {
    if: 'webpack',
    name: 'description',
    message: '',
  },
  {
    multiple: true,
    choices: [
      {value: 'extract-css', if: 'webpack', selected: true},
      {value: 'postcss'},
      {value: 'sass', selected: true}
    ]
  }
];

test('run runs through questionnaire in unattended mode', async t => {
  const result = await run(questions, {unattended: true});
  t.deepEqual(result, [
    {name: 'my-app', description: ''},
    ['webpack', 'extract-css', 'sass'],
    []
  ]);
});

test('run runs through questionnaire in unattended mode with preselectedFeatures and predefinedProperties', async t => {
  const result = await run(questions, {
    unattended: true,
    preselectedFeatures: ['postcss'],
    predefinedProperties: {name: 'new-app'}
  });
  t.deepEqual(result, [
    {name: 'new-app', description: ''},
    ['webpack', 'postcss'],
    ['postcss']
  ]);
});

test('run runs through questionnaire in unattended mode with preselectedFeatures and predefinedProperties, and keeps unknown properties', async t => {
  const result = await run(questions, {
    unattended: true,
    preselectedFeatures: ['postcss'],
    predefinedProperties: {name: 'new-app', foo: 'bar'}
  });
  t.deepEqual(result, [
    {name: 'new-app', description: '', foo: 'bar'},
    ['webpack', 'postcss'],
    ['postcss']
  ]);
});

test('run runs through questionnaire', async t => {
  let result = await run(questions, {_debug: ['new-app', 2, [1, 2]]});
  t.deepEqual(result, [
    {name: 'new-app'},
    ['dumber', 'postcss', 'sass'],
    ['dumber', 'postcss', 'sass']
  ]);
  result = await run(questions, {_debug: ['new-app', 1, 'lorem', [1, 2]]});
  t.deepEqual(result, [
    {name: 'new-app', description: 'lorem'},
    ['webpack', 'extract-css', 'postcss'],
    ['extract-css', 'postcss']
  ]);
});

test('run runs through questionnaire with preselectedFeatures and predefinedProperties', async t => {
  const result = await run(questions, {
    preselectedFeatures: ['postcss'],
    predefinedProperties: {name: 'new-app'},
    _debug: [2]
  });
  t.deepEqual(result, [
    {name: 'new-app'},
    ['dumber', 'postcss'],
    ['dumber', 'postcss']
  ]);
});

test('run runs through questionnaire with preselectedFeatures and predefinedProperties, and keeps unknown properties and selection', async t => {
  const result = await run(questions, {
    preselectedFeatures: ['postcss', 'lorem', 'abc', 'lorem'],
    predefinedProperties: {name: 'new-app', foo: 'bar'},
    _debug: [2]
  });
  t.deepEqual(result, [
    {name: 'new-app', foo: 'bar'},
    ['dumber', 'postcss', 'lorem', 'abc'],
    ['dumber', 'postcss', 'lorem', 'abc']
  ]);
});

test('run rejects missing name/choices', async t => {
  await t.throwsAsync(async () => run([{}], {}));
});

test('run ignores name field on selection question', async t => {
  let result = await run([{name: 'foo', choices: [{value: 'a'}]}], {});
  t.deepEqual(result, [{}, ['a'], []]);
});

test('run rejects wrong choices', async t => {
  await t.throwsAsync(async () => run([{
    choices: 'lorem'
  }], {}));
});

test('run rejects multi-select with missing value', async t => {
  await t.throwsAsync(async () => run([{
    multiple: true,
    choices: [
      {},
      {value: 'postcss'},
      {value: 'sass', selected: true}
    ]
  }], {}));
});
