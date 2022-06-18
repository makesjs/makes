import {test} from 'zora';
import run from '../lib/run.js';

const ls = process.platform === 'win32' ? 'dir' : 'ls';
const cmdThatWait = process.platform === 'win32' ? 'cmd' : 'tail';

test('run a command', async t => {
  await run('echo', ['hello']);
  t.ok(true, 'successfully run a command');
});

test('run a command in a different cwd', async t => {
  await run(ls, ['index.js'], 'lib');
  t.ok(true, 'successfully run a command in a different cwd');
});

test('run a command, catch failure', async t => {
  try {
    await run(ls, ['no-such-file'], 'lib');
    t.fail('Should not pass');
  } catch (err) {
    t.ok(err, err.message);
  }
});

test('run a command, catch signal on exit', async t => {
  const cmd = run(cmdThatWait);

  setTimeout(() => {
    cmd.proc.kill();
  }, 200);

  try {
    await cmd;
    t.fail('Should not pass');
  } catch (err) {
    t.is(err.message, cmdThatWait + ' exit signal: SIGTERM');
  }
});
