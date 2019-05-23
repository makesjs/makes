const spawn = require('cross-spawn');

module.exports = function(command, args = [], dir = '.') {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {stdio: 'inherit', cwd: dir});

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
