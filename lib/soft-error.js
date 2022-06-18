import c from 'ansi-colors';

export default class SoftError extends Error {
  constructor(message) {
    super(c.red(message));
    this.name = 'SoftError';
  }
}
