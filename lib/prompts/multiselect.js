import color from 'ansi-colors';
import Prompt from './prompt.js';
import { cursor } from 'sisteransi';
import { clear, figures, style, lead } from './util/index.js';

/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
export default class MultiselectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.hint = opts.hint || '- Multi-select. Use arrow-keys to navigate. Space or numbers to select. Return to submit';
    this.warn = opts.warn || '- This option is disabled';
    this.maxChoices = opts.max;
    this.choices = opts.choices.map(ch => {
      if (typeof ch === 'string')
        ch = {title: ch, value: ch};
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && ch.value,
        hint: ch && ch.hint,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear('');
    this.render();
  }

  get value() {
    return this.choices.filter(v => v.selected).map(v => v.value);
  }

  reset() {
    this.choices.map(v => v.selected = false);
    this.cursor = 0;
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
    if(this.choices[this.cursor].disabled) {
      this.bell();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.choices.length - 1;
    this.render();
  }

  next() {
    this.cursor = (this.cursor + 1) % this.choices.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.choices.length - 1;
    } else {
      this.cursor -= 1;
    }

    this.render();
  }

  down() {
    if (this.cursor === this.choices.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor += 1;
    }
    this.render();
  }

  left() {
    this.choices[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.choices.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.choices[this.cursor].selected = true;
    this.render();
  }

  _(c, key) {  // eslint-disable-line no-unused-vars
    let v;
    if (c === ' ') {
      v = this.choices[this.cursor];
    } else if (c >= '1' && c <= '9') {
      const idx = parseInt(c, 10) - 1;
      if (idx < this.choices.length) {
        v = this.choices[idx];
      }
    }

    if (v) {
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.choices.filter(e => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    } else {
      return this.bell();
    }
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render();

    // print prompt
    const selected = this.choices
      .filter(e => e.selected)
      .map(v => v.title)
      .join(', ');
    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.done ? color.cyan(selected) : (
        this.choices[this.cursor].disabled ? color.yellow(this.warn) : color.dim(this.hint)
      )
    ].join(' ');

    // print choices
    if (!this.done) {
      const c = this.cursor;
      prompt +=
        '\n' +
        this.choices
          .map((v, i) => {
            let title = v.title;
            if (v.disabled) title = c === i ? color.dim.underline(title) : color.strikethrough.dim(title);
            else title = c === i ? color.cyan.underline(title) : title;

            let choice = (v.selected ? color.green(figures.bullet) : color.dim(figures.bullet)) + ' ' + title;
            if (v.hint) {
              choice += `\n${color.dim(lead(v.hint, 2))}`;
            }
            return choice;
          })
          .join('\n');
    }

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt);
  }
}
