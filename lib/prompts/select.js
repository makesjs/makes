const color = require('ansi-colors');
const Prompt = require('./prompt');
const { style, clear, figures } = require('./util');
const { erase, cursor } = require('sisteransi');

/**
 * SelectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class SelectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
    this.warn = opts.warn || '- This option is disabled';
    this.cursor = opts.initial || 0;
    this.choices = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value || idx),
        hint: ch && ch.hint,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.value = (this.choices[this.cursor] || {}).value;
    this.clear = clear('');
    this.render();
  }

  moveCursor(n) {
    this.cursor = n;
    this.value = this.choices[n].value;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
    this.fire();
    this.render();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    if (!this.selection.disabled) {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    } else
      this.bell();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  up() {
    this.moveCursor(this.cursor === 0 ? this.choices.length - 1 : this.cursor - 1);
    this.render();
  }

  down() {
    this.moveCursor(this.cursor === this.choices.length - 1 ? 0 : this.cursor + 1);
    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.choices.length);
    this.render();
  }

  _(c, key) { // eslint-disable-line no-unused-vars
    if (c === ' ') return this.submit();
    if (c >= '1' && c <= '9') {
      const idx = parseInt(c, 10) - 1;
      if (idx < this.choices.length) {
        this.moveCursor(idx);
        this.render();
      }
    }
  }

  get selection() {
    return this.choices[this.cursor];
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(erase.lines(this._lastRenderedLineCount));
    super.render();

    // Print prompt
    this.out.write([
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.done ? this.selection.title : (
        this.selection.disabled ? color.yellow(this.warn) : color.dim(this.hint)
      )
    ].join(' '));

    // Print choices
    if (!this.done) {
      let lineCount = 0;

      const body = this.choices
        .map((v, i) => {
          let title, prefix;
          if (v.disabled) {
            title = this.cursor === i ? color.dim.underline(v.title) : color.strikethrough.dim(v.title);
            prefix = this.cursor === i ? color.bold.dim(figures.pointer) : ' ';
          } else {
            title = this.cursor === i ? color.cyan.underline(v.title) : v.title;
            prefix = this.cursor === i ? color.cyan(figures.pointer) : ' ';
          }
          let choice = `${prefix} ${title}`;
          lineCount += 1;
          if (v.hint) {
            choice += `\n  ${color.dim(v.hint)}`;
            lineCount += 1;
          }
          return choice;
        })
        .join('\n');

      this.out.write('\n' + body);
      lineCount += 1;
      this._lastRenderedLineCount = lineCount;
    }
  }
}

module.exports = SelectPrompt;
