const prompts = require('../../lib/prompts');
const {Readable, Writable} = require('stream');

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

const text = wrap(prompts.text);
const select = wrap(prompts.select);
module.exports = {delay, pressKeys, text, select};
