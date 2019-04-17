import {text as _text, select as _select, multiselect as _multiselect} from '../../lib/prompts';
import {Readable, Writable} from 'stream';

function delay() {
  return new Promise(resolve => {
    setTimeout(resolve, 10);
  });
}

async function pressKeys(stream, keys = []) {
  for (let i = 0, len = keys.length; i < len; i++) {
    await delay();
    let key = keys[i];
    if (typeof key === 'string') {
      stream.emit('keypress', key, {name: key});
    } else {
      stream.emit('keypress', null, key);
    }
  }
}

function wrap(prompt) {
  return function(opts = {}, keys = []) {
    const debugIn = new Readable({read() {}});
    const nullOut = new Writable({write(c, e, cb) {cb();}});
    pressKeys(debugIn, keys);
    return prompt({...opts, in: debugIn, out: nullOut}).then(
      answer => {
        debugIn.destroy();
        nullOut.destroy();
        return answer;
      },
      e => {
        debugIn.destroy();
        nullOut.destroy();
        throw e;
      }
    );
  };
}

const text = wrap(_text);
const select = wrap(_select);
const multiselect = wrap(_multiselect);
export {delay, pressKeys, text, select, multiselect};
