import {test} from 'zora';
import {text} from './_prompt-under-test.mjs';

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
  try {
    await text({
      message: 'prompt',
      validate: input => !input.includes('*')
    }, ['a', '*', 'c', {name: 'return'}, {name: 'abort'}]);
    t.fail('should not pass');
  } catch (e) {
    t.is(e.name, 'SoftError');
    t.ok(e.message.match(/abort with answer a\*c/), e.message);
  }
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

test('text prompt support terminal cursor short-cut, case 2', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'a', 'b', 'c', ' ', 'd', 'e', ' ',
    {name: 'w', ctrl: true}, // delete word
    'f', '-', '3', ' ', ' ',
    {name: 'w', ctrl: true}, // delete word
    'e', 'f', 'g',
    {name: 'left'},
    {name: 'left'},
    {name: 'left'},
    {name: 'u', ctrl: true}, // delete to beginning
    {name: 'return'}
  ]);

  t.is(answer, 'efg');
});

test('text prompt support terminal cursor short-cut, case 3', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'a', 'b', 'c', ' ', ' ', 'd', 'e',
    {name: 'left'},
    {name: 'w', ctrl: true}, // delete word
    {name: 'w', ctrl: true}, // delete word
    'e', 'f',
    {name: 'return'}
  ]);

  t.is(answer, 'efe');
});

test('text prompt support terminal cursor short-cut, case 4', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'a', 'b', 'c', ' ', 'd', 'e', ' ',
    {name: 'left'},
    {name: 'left'},
    {name: 'k', ctrl: true}, // delete to end
    {name: 'return'}
  ]);

  t.is(answer, 'abc d');
});

test('vi keybinds does not break text input', async (t) => {
  const answer = await text({
    message: 'prompt',
    validate: input => !input.includes('*')
  }, [
    'h', 'j', 'k', ' ', 'l', 'e', ' ',
    {name: 'left'},
    {name: 'left'},
    {name: 'k', ctrl: true}, // delete to end
    {name: 'return'}
  ]);

  t.is(answer, 'hjk l');
});
