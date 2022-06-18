import {test} from 'zora';
import {select} from './_prompt-under-test.js';

test('multiselect prompt returns default empty selection', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [{name: 'return'}]);

  t.deepEqual(answer, []);
});

test('multiselect prompt allows empty string value, toggle with space', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: '', title: 'One', hint: 'Lorem ipsum dolor sit amet.'},
      {value: 'two', title: 'Two'}
    ]
  }, [' ', {name: 'return'}]);

  t.deepEqual(answer, ['']);
});

test('multiselect prompt allows empty string value, toggle with space, case2', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: '', title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [' ', ' ', {name: 'down'}, ' ', {name: 'return'}]);

  t.deepEqual(answer, ['two']);
});

test('multiselect prompt allows missing value', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [' ', {name: 'return'}]);

  t.deepEqual(answer, [undefined]);
});

test('multiselect prompt returns user multiselection', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [' ', {name: 'down'}, ' ', {name: 'return'}]);

  t.deepEqual(answer, ['one', 'two']);
});

test('multiselect prompt returns user multiselection, case2', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'down'}, ' ', {name: 'down'}, ' ', {name: 'return'}]);

  t.deepEqual(answer, ['two', 'three']);
});

test('multiselect prompt returns user multiselection, case3', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      'one',
      'two',
      'three',
    ]
  }, [' ', {name: 'down'}, ' ', {name: 'down'}, ' ', {name: 'down'}, ' ', {name: 'return'}]);
  // wrapped to top
  t.deepEqual(answer, ['two', 'three']);
});

test('multiselect prompt returns user multiselection with number shortcut', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', '2', {name: 'return'}]);

  t.deepEqual(answer, ['two', 'three']);
});

test('multiselect prompt returns user multiselection with number shortcut to toggle', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      'one',
      'two',
      'three',
    ]
  }, ['3', '1', '3', '2', {name: 'return'}]);

  t.deepEqual(answer, ['one', 'two']);
});

test('multiselect prompt can reset', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', {name: 'g', ctrl: true}, {name: 'return'}]);

  t.deepEqual(answer, []);
});

test('multiselect prompt can abort', async (t) => {
  try {
    await select({
      multiple: true,
      message: 'prompt',
      choices: [
        {value: 'one', title: 'One'},
        {value: 'two', title: 'Two'},
        {value: 'three', title: 'Three'}
      ]
    }, ['1', '3', {name: 'c', ctrl: true}]);
    t.fail('should not pass');
  } catch (e) {
    t.is(e.name, 'SoftError');
    t.ok(e.message.match(/abort with answer one,three/), e.message);
  }
});

test('multiselect prompt supports terminal short-cut to start', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', {name: 'a', ctrl: true}, ' ', {name: 'enter'}]);

  t.deepEqual(answer, ['one', 'three']);
});

test('multiselect prompt supports terminal short-cut to end', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'e', ctrl: true}, ' ', {name: 'enter'}]);

  t.deepEqual(answer, ['three']);
});

test('multiselect prompt supports terminal short-cut tab', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'tab'}, ' ', {name: 'enter'}]);

  t.deepEqual(answer, ['two']);
});

test('multiselect prompt supports left/right toggle', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [
    '2',
    {name: 'down'},
    {name: 'left'},
    {name: 'down'},
    {name: 'right'},
    {name: 'up'},
    {name: 'up'},
    {name: 'right'},
    {name: 'enter'}
  ]);

  t.deepEqual(answer, ['one', 'three']);
});

test('multiselect prompt supports vi keybind toggle', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [
    '2',
    {name: 'j'},
    {name: 'h'},
    {name: 'j'},
    {name: 'l'},
    {name: 'k'},
    {name: 'k'},
    {name: 'l'},
    {name: 'enter'}
  ]);

  t.deepEqual(answer, ['one', 'three']);
});

test('multiselect prompt limits selection with max', async (t) => {
  const answer = await select({
    multiple: true,
    message: 'prompt',
    choices: [
      'one',
      'two',
      'three',
    ],
    max: 2,
  }, ['1', '3', '2', {name: 'return'}]);

  t.deepEqual(answer, ['one', 'three']);
});
