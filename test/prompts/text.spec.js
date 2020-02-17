const test = require('ava');
const {text} = require('./_prompt-under-test');

test('text prompt returns default value', async (t) => {
  const answer = await text({
    message: 'prompt',
    default: 'hello'
  }, [{name: 'return'}]);

  t.is(answer, 'hello');
});


test('text prompt can append default value', async (t) => {
  const answer = await text({
    message: 'prompt',
    default: 'hello'
  }, [{name: 'tab'}, 'm', 'e', {name: 'return'}]);

  t.is(answer, 'hellome');
});

test('text prompt returns default empty string', async (t) => {
  const answer = await text({
    message: 'prompt',
  }, [{name: 'return'}]);

  t.is(answer, '');
});

test('text prompt returns user input', async (t) => {
  const answer = await text({
    message: 'prompt',
  }, ['a', 'b', 'c', {name: 'return'}]);

  t.is(answer, 'abc');
});

test('text prompt rejects invalid input', async (t) => {
  await t.throwsAsync(text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, ['a', '*', 'c', {name: 'return'}, {name: 'abort'}]), {
    name: 'SoftError',
    message: /abort with answer a\*c/
  });
});

test('text prompt rejects invalid input, allows correction', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'a', '*', 'c',
    {name: 'return'},
    {name: 'backspace'},
    {name: 'backspace'},
    'd',
    {name: 'return'},
  ]);

  t.is(answer, 'ad');
});

test('text prompt rejects invalid input, allows correction, case2', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => input.includes('*') ? 'cannot use *' : null
  }, [
    'a', '*', 'c',
    {name: 'return'},
    {name: 'g', ctrl: true}, // reset
    'd',
    {name: 'return'},
  ]);

  t.is(answer, 'd');
});

test('text prompt support terminal cursor short-cut', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'a', 'b', 'c',
    {name: 'a', ctrl: true}, // to start
    {name: 'delete'},
    'd',
    {name: 'e', ctrl: true}, // to end
    'e',
    {name: 'left'},
    'f',
    {name: 'right'},
    'g',
    {name: 'return'},
  ]);

  t.is(answer, 'dbcfeg');
});