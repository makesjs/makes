import test from 'ava';
import run from '../lib/run';

test('run a command', async t => {
  await run('echo hello');
  t.pass('successfully run a command');
});

test('run a command in a different cwd', async t => {
  await run('ls index.js', 'lib');
  t.pass('successfully run a command in a different cwd');
});

test('run a command, catch failure', async t => {
  await t.throwsAsync(async () => run('ls no-such-file', 'lib'));
});
