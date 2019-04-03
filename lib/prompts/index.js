const Select = require('./select');
const Text = require('./Text');
const noop = v => v;

exports.select = function(opts = {}) {
  return new Promise((res, rej) => {
    const p = new Select(opts);
    p.on('state', opts.onState || noop);
    p.on('submit', x => res(x));
    p.on('abort', x => rej(x));
  });
};

exports.text = function(opts = {}) {
  return new Promise((res, rej) => {
    const p = new Text(opts);
    p.on('state', opts.onState || noop);
    p.on('submit', x => res(x));
    p.on('abort', x => rej(x));
  });
};