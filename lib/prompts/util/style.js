const c = require('ansi-colors');
const figures = require('./figures');

// rendering user input.
const styles = Object.freeze({
  password: { scale: 1, render: input => '*'.repeat(input.length) },
  emoji: { scale: 2, render: input => '😃'.repeat(input.length) },
  invisible: { scale: 0, render: () => '' },
  default: { scale: 1, render: input => `${input}` }
});
const render = type => styles[type] || styles.default;

// icon to signalize a prompt.
const symbols = Object.freeze({
  aborted: c.red(figures.cross),
  done: c.green(figures.tick),
  default: c.cyan('?')
});

const symbol = (done, aborted) =>
  aborted ? symbols.aborted : done ? symbols.done : symbols.default;

// between the question and the user's input.
const delimiter = completing =>
  c.dim(completing ? figures.ellipsis : figures.pointerSmall);

const item = (expandable, expanded) =>
  c.dim(expandable ? (expanded ? figures.pointerSmall : '+') : figures.line);

module.exports = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item
};
