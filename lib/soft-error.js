const c = require('ansi-colors');
class SoftError extends Error {
  constructor(message) {
    super(c.red(message));
    this.name = 'SoftError';
  }
}

module.exports = SoftError;
