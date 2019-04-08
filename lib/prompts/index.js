import Select from './select';
import Multiselect from './multiselect';
import Text from './text';

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

export const select = toPrompt(Select);
export const multiselect = toPrompt(Multiselect);
export const text = toPrompt(Text);
