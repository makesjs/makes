import test from 'ava';
import applicable from '../lib/applicable';

test('applicable supports logical not', t => {
  t.true(applicable(['a', 'b'], 'not_c'));
  t.false(applicable(['a', 'b'], 'not_a'));
  t.false(applicable(['a', 'b'], 'not_b'));
  t.true(applicable(['a', 'b'], '!c'));
  t.false(applicable(['a', 'b'], '!a'));
  t.false(applicable(['a', 'b'], '!b'));
  t.true(applicable(['a', 'b'], '! c'));
  t.false(applicable(['a', 'b'], '! a'));
  t.false(applicable(['a', 'b'], '! b'));
});

test('applicable supports logical and', t => {
  t.true(applicable(['a', 'b'], 'a_and_b'));
  t.false(applicable(['a', 'b'], 'a_and_c'));
  t.false(applicable(['a', 'b'], 'c_and_b'));
  t.false(applicable(['a', 'b'], 'c_and_d'));
  t.true(applicable(['a', 'b'], 'a&&b'));
  t.false(applicable(['a', 'b'], 'a&&c'));
  t.false(applicable(['a', 'b'], 'c&&b'));
  t.false(applicable(['a', 'b'], 'c&&d'));
  t.true(applicable(['a', 'b'], 'a && b'));
  t.false(applicable(['a', 'b'], 'a && c'));
  t.false(applicable(['a', 'b'], 'c && b'));
  t.false(applicable(['a', 'b'], 'c && d'));
});

test('applicable supports logical or', t => {
  t.true(applicable(['a', 'b'], 'a_or_b'));
  t.true(applicable(['a', 'b'], 'a_or_c'));
  t.true(applicable(['a', 'b'], 'c_or_b'));
  t.false(applicable(['a', 'b'], 'c_or_d'));
  t.true(applicable(['a', 'b'], 'a||b'));
  t.true(applicable(['a', 'b'], 'a||c'));
  t.true(applicable(['a', 'b'], 'c||b'));
  t.false(applicable(['a', 'b'], 'c||d'));
  t.true(applicable(['a', 'b'], 'a || b'));
  t.true(applicable(['a', 'b'], 'a || c'));
  t.true(applicable(['a', 'b'], 'c || b'));
  t.false(applicable(['a', 'b'], 'c || d'));
});

test('applicable supports long logical expression', t => {
  t.true(applicable(['a-c', 'b'], 'not_a-c_or_b'));
  t.false(applicable(['a-c', 'b'], 'not_a-c_or_c'));
  t.true(applicable(['a-c', 'b'], 'not_c_or_b'));
  t.true(applicable(['a-c', 'b'], 'not_c_or_d'));
  t.false(applicable(['a-c', 'b'], 'not_a-c_and_b'));
  t.false(applicable(['a-c', 'b'], 'not_a_and_c'));
  t.true(applicable(['a-c', 'b'], 'not_c_and_b'));
  t.false(applicable(['a-c', 'b'], 'not_c_and_d'));

  t.true(applicable(['a-c', 'b'], '!a-c||b'));
  t.false(applicable(['a-c', 'b'], '!a-c||c'));
  t.true(applicable(['a-c', 'b'], '!c||b'));
  t.true(applicable(['a-c', 'b'], '!c||d'));
  t.false(applicable(['a-c', 'b'], '!a-c&&b'));
  t.false(applicable(['a-c', 'b'], '!a-c&&c'));
  t.true(applicable(['a-c', 'b'], '!c&&b'));
  t.false(applicable(['a-c', 'b'], '!c&&d'));

  t.true(applicable(['a-c', 'b'], '! a-c || b'));
  t.false(applicable(['a-c', 'b'], '! a-c || c'));
  t.true(applicable(['a-c', 'b'], '! c || b'));
  t.true(applicable(['a-c', 'b'], '! c || d'));
  t.false(applicable(['a-c', 'b'], '! a-c && b'));
  t.false(applicable(['a-c', 'b'], '! a-c && c'));
  t.true(applicable(['a-c', 'b'], '! c && b'));
  t.false(applicable(['a-c', 'b'], '! c && d'));
});

test('applicable supports parenthesis', t => {
  t.false(applicable(['a', 'b', 'c'], 'not a and d'));
  t.true(applicable(['a', 'b', 'c'], 'not (a and d)'));

  t.true(applicable(['a', 'b', 'c'], 'd && e || c'));
  t.false(applicable(['a', 'b', 'c'], 'd &&(e || c)'));
});

test('applicable complains about broken expression', t => {
  t.throws(() => applicable([], 'not (a and c'));
  t.throws(() => applicable([], 'a&&||b'));
});