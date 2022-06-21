const spawn = require('cross-spawn');

module.exports = function (command, args = [], dir = '.') {
  let proc;
  const p = new Promise((resolve, reject) => {
    proc = spawn(command, args, {stdio: 'inherit', cwd: dir});

    proc.on('error', reject);
    proc.on('exit', (code, signal) => {
      if (code) {
        reject(new Error(`${command} exit code: ${code}`));
      } else if (signal) {
        reject(new Error(`${command} exit signal: ${signal}`));
      } else {
        resolve();
      }
    });
  });

  p.proc = proc;
  return p;
};
