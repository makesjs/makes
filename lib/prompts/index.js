import Select from './select.js';
import Multiselect from './multiselect.js';
import Text from './text.js';
import SoftError from '../soft-error.js';

const noop = v => v;

function toPrompt(type) {
  return function(opts = {}) {
    return new Promise((res, rej) => {
      const p = new type(opts);
      p.on('state', opts.onState || noop);
      p.on('submit', x => res(x));
      p.on('abort', x => rej(new SoftError(`abort with answer ${x}`)));
    });
  };
}

const singleselect = toPrompt(Select);
const multiselect = toPrompt(Multiselect);

export function select(opts) {
  return opts && opts.multiple ? multiselect(opts) : singleselect(opts);
}
export const text = toPrompt(Text);
