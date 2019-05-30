const spawn = require('cross-spawn');

module.exports = function(command, args = [], dir = '.') {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {stdio: 'inherit', cwd: dir});

    proc.on('error', reject);
    proc.on('exit', (code, signal) => {
      if (code) {
        let message = `${command} exit code: ${code}`;
        if (signal) message += ` signal: ${signal}`;
        reject(new Error(message));
      } else {
        resolve();
      }
    });
  });
};
