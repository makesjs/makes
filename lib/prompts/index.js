const Select = require('./select');
const Multiselect = require('./multiselect');
const Text = require('./text');

const noop = v => v;

function toPrompt(type) {
  return function(opts = {}) {
    return new Promise((res, rej) => {
      const p = new type(opts);
      p.on('state', opts.onState || noop);
      p.on('submit', x => res(x));
      p.on('abort', x => rej(new Error(`abort with answer ${x}`)));
    });
  };
}

const select = toPrompt(Select);
const multiselect = toPrompt(Multiselect);
exports.select = function(opts) {
  return opts && opts.multiple ? multiselect(opts) : select(opts);
};
exports.text = toPrompt(Text);
