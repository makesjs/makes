const {test} = require('zora');
const lead = require('../../../lib/prompts/util/lead');
const color = require('ansi-colors');

test('lead returns original string if no lead required', t => {
  t.is(lead('Lorem ipsum dolor.', 0, 10), 'Lorem ipsum dolor.');
});

test('lead returns only modified first line if perLine is too short', t => {
  t.is(lead('Lorem ipsum dolor.', 1, 5), ' Lorem ipsum dolor.');
});

test('lead returns modified lines, merges leading spaces', t => {
  t.is(lead('Lorem ipsum dolor.', 1, 6), ' Lorem\n ipsum\n dolor\n .');
});

test('lead returns modified lines', t => {
  t.is(lead('Lorem ipsum dolor sit amet.', 1, 7), ' Lorem \n ipsum \n dolor \n sit am\n et.');
});

test('lead returns modified lines, strips off ansi colors', t => {
  t.is(
    lead(`Lorem ${color.gray('ipsum dolor')} sit ${color.dim('amet.')}`, 1, 7),
    ' Lorem \n ipsum \n dolor \n sit am\n et.'
  );
});
