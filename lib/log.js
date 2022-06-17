/* eslint-disable no-console */
export function info(message) {
  console.info(`\x1b[36m[makes] ${message}\x1b[0m`);
}

export function warn(message) {
  console.warn(`\x1b[32m[makes] ${message}\x1b[0m`);
}

export function error(message) {
  console.error(`\x1b[31m[makes] ${message}\x1b[0m`);
}
