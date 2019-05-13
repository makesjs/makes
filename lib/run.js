const {spawn} = require('child_process');

module.exports = function(command, dir) {
  const [cmd, ...args] = command.split(/\s+/);
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args,
      { stdio: 'inherit', cwd: dir }
    );

    proc.on('error', reject);

    proc.on('exit', (code, signal) => {
      if (code) {
        reject(new Error('Process exit code: ' + code + ' signal: ' + signal));
      } else {
        resolve();
      }
    });
  });
};
