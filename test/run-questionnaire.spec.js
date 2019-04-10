import test from 'ava';
import {Readable, Writable} from 'stream';
import {pressKeys} from './prompts/_prompt-under-test';
import run, {textPrompt, selectPrompt} from '../src/run-questionnaire';

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

test('selectPrompt rejects invalid choice value', async t => {
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'a&b'}]}, [], {preselectedFeatures: []}));
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'a b'}]}, [], {preselectedFeatures: []}));
});

test('selectPrompt rejects empty choice value on not-first choice', async t => {
  await t.throwsAsync(async () => selectPrompt({choices:[{value:'a'},{}]}, [], {preselectedFeatures: []}));
});

test('selectPrompt returns value of the only choice without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{value:'a'}]}, pickedFeatures, {preselectedFeatures: []});
  t.deepEqual(pickedFeatures, ['a']);
});

test('selectPrompt ignores empty value without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{}]}, pickedFeatures, {preselectedFeatures: []});
  t.deepEqual(pickedFeatures, []);
});

test('selectPrompt returns preselected without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: ['b']});
  t.deepEqual(pickedFeatures, ['b']);
});

test('selectPrompt cleans up conflicted preselected without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{}, {value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: ['b', 'a']});
  t.deepEqual(pickedFeatures, ['a']);
});

test('selectPrompt returns first choice in unattended mode without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: [], unattended: true});
  t.deepEqual(pickedFeatures, ['a']);
});

test('selectPrompt still returns preselected in unattended mode without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({choices:[{value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: ['b'], unattended: true});
  t.deepEqual(pickedFeatures, ['b']);
});

test('selectPrompt prompts for user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, [{name: 'down'}, {name: 'return'}]);

  const pickedFeatures = [];
  await selectPrompt({
    choices:[{value: 'a'}, {value: 'b'}, {value: 'c'}],
    in: debugIn,
    out: nullOut
  }, pickedFeatures, {preselectedFeatures: []});

  t.deepEqual(pickedFeatures, ['b']);
});

test('selectPrompt (multiselect) returns preselected without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({multiple: true, choices:[{value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: ['b']});
  t.deepEqual(pickedFeatures, ['b']);
});

test('selectPrompt (multiselect) returns empty list in unattended mode without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({multiple: true, choices:[{value: 'a'}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: [], unattended: true});
  t.deepEqual(pickedFeatures, []);
});

test('selectPrompt (multiselect) still returns preselected in unattended mode without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({multiple: true, choices:[{value: 'a', selected: true}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: ['b'], unattended: true});
  t.deepEqual(pickedFeatures, ['b']);
});

test('selectPrompt (multiselect) returns default selected in unattended mode without prompting', async t => {
  const pickedFeatures = [];
  await selectPrompt({multiple: true, choices:[{value: 'a', selected: true}, {value: 'b'}]}, pickedFeatures, {preselectedFeatures: [], unattended: true});
  t.deepEqual(pickedFeatures, ['a']);
});

test('selectPrompt (multiselect) prompts for user input', async t => {
  const debugIn = new Readable({read() {}});
  const nullOut = new Writable({write(c, e, cb) {cb();}});

  pressKeys(debugIn, [{name: 'down'}, ' ', {name: 'return'}]);

  const pickedFeatures = [];
  await selectPrompt({
    multiple: true,
    choices:[{value: 'a'}, {value: 'b'}, {value: 'c', selected: true}],
    in: debugIn,
    out: nullOut
  }, pickedFeatures, {preselectedFeatures: []});

  t.deepEqual(pickedFeatures, ['b', 'c']);
});

test('selectPrompt supports conditional choice', async t => {
  const pickedFeatures = ['w'];
  await selectPrompt({choices:[{value: 'a', if: '!w'}, {value: 'b', if: 'w'}]}, pickedFeatures, {preselectedFeatures: ['b']});
  t.deepEqual(pickedFeatures, ['w', 'b']);
  await selectPrompt({choices:[{value: 'c', if: '!w'}, {value: 'd', if: 'w'}, {value: 'e'}]}, pickedFeatures, {preselectedFeatures: ['b'], _debug: [2]});
  t.deepEqual(pickedFeatures, ['w', 'b', 'e']);
});

test('selectPrompt skip empty choices after condition', async t => {
  const pickedFeatures = ['w'];
  await selectPrompt({choices:[{value: 'a', if: '!w'}, {value: 'b', if: '!w'}]}, pickedFeatures, {preselectedFeatures: []});
  t.deepEqual(pickedFeatures, ['w']);
});

test('selectPrompt (multiselect) supports conditional choice', async t => {
  const pickedFeatures = ['w'];
  await selectPrompt({multiple: true, choices:[{value: 'c', if: '!w'}, {value: 'd', if: 'w'}, {value: 'e'}]}, pickedFeatures, {preselectedFeatures: ['b'], _debug: [[1,2]]});
  t.deepEqual(pickedFeatures, ['w', 'd', 'e']);
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
  t.deepEqual(result, [{name: 'my-app', description: ''}, ['webpack', 'extract-css', 'sass']]);
});

test('run runs through questionnaire in unattended mode with preselectedFeatures and predefinedProperties', async t => {
  const result = await run(questions, {
    unattended: true,
    preselectedFeatures: ['postcss'],
    predefinedProperties: {name: 'new-app'}
  });
  t.deepEqual(result, [{name: 'new-app', description: ''}, ['webpack', 'postcss']]);
});

test('run runs through questionnaire', async t => {
  let result = await run(questions, {_debug: ['new-app', 2, [1, 2]]});
  t.deepEqual(result, [{name: 'new-app'}, ['dumber', 'postcss', 'sass']]);
  result = await run(questions, {_debug: ['new-app', 1, 'lorem', [1, 2]]});
  t.deepEqual(result, [{name: 'new-app', description: 'lorem'}, ['webpack', 'extract-css', 'postcss']]);
});

test('run runs through questionnaire with preselectedFeatures and predefinedProperties', async t => {
  const result = await run(questions, {
    preselectedFeatures: ['postcss'],
    predefinedProperties: {name: 'new-app'},
    _debug: [2]
  });
  t.deepEqual(result, [{name: 'new-app'}, ['dumber', 'postcss']]);
});

test('run rejects missing name/choices', async t => {
  await t.throwsAsync(async () => run([{}]));
});

test('run ignores name field on selection question', async t => {
  let result = await run([{name: 'foo', choices: [{value: 'a'}]}], {});
  t.deepEqual(result, [{}, ['a']]);
});
