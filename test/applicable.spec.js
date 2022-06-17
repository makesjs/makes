import {test} from 'zora';
import applicable from '../lib/applicable.js';

test('applicable supports logical not', t => {
  t.truthy(applicable(['a', 'b'], 'not_c'));
  t.falsy(applicable(['a', 'b'], 'not_a'));
  t.falsy(applicable(['a', 'b'], 'not_b'));
  t.truthy(applicable(['a', 'b'], '!c'));
  t.falsy(applicable(['a', 'b'], '!a'));
  t.falsy(applicable(['a', 'b'], '!b'));
  t.truthy(applicable(['a', 'b'], '! c'));
  t.falsy(applicable(['a', 'b'], '! a'));
  t.falsy(applicable(['a', 'b'], '! b'));
});

test('applicable supports logical and', t => {
  t.truthy(applicable(['a', 'b'], 'a_and_b'));
  t.falsy(applicable(['a', 'b'], 'a_and_c'));
  t.falsy(applicable(['a', 'b'], 'c_and_b'));
  t.falsy(applicable(['a', 'b'], 'c_and_d'));
  t.truthy(applicable(['a', 'b'], 'a&&b'));
  t.falsy(applicable(['a', 'b'], 'a&&c'));
  t.falsy(applicable(['a', 'b'], 'c&&b'));
  t.falsy(applicable(['a', 'b'], 'c&&d'));
  t.truthy(applicable(['a', 'b'], 'a && b'));
  t.falsy(applicable(['a', 'b'], 'a && c'));
  t.falsy(applicable(['a', 'b'], 'c && b'));
  t.falsy(applicable(['a', 'b'], 'c && d'));
});

test('applicable supports logical or', t => {
  t.truthy(applicable(['a', 'b'], 'a_or_b'));
  t.truthy(applicable(['a', 'b'], 'a_or_c'));
  t.truthy(applicable(['a', 'b'], 'c_or_b'));
  t.falsy(applicable(['a', 'b'], 'c_or_d'));
  t.truthy(applicable(['a', 'b'], 'a||b'));
  t.truthy(applicable(['a', 'b'], 'a||c'));
  t.truthy(applicable(['a', 'b'], 'c||b'));
  t.falsy(applicable(['a', 'b'], 'c||d'));
  t.truthy(applicable(['a', 'b'], 'a || b'));
  t.truthy(applicable(['a', 'b'], 'a || c'));
  t.truthy(applicable(['a', 'b'], 'c || b'));
  t.falsy(applicable(['a', 'b'], 'c || d'));
});

test('applicable supports long logical expression', t => {
  t.truthy(applicable(['a-c', 'b'], 'not_a-c_or_b'));
  t.falsy(applicable(['a-c', 'b'], 'not_a-c_or_c'));
  t.truthy(applicable(['a-c', 'b'], 'not_c_or_b'));
  t.truthy(applicable(['a-c', 'b'], 'not_c_or_d'));
  t.falsy(applicable(['a-c', 'b'], 'not_a-c_and_b'));
  t.falsy(applicable(['a-c', 'b'], 'not_a_and_c'));
  t.truthy(applicable(['a-c', 'b'], 'not_c_and_b'));
  t.falsy(applicable(['a-c', 'b'], 'not_c_and_d'));

  t.truthy(applicable(['a-c', 'b'], '!a-c||b'));
  t.falsy(applicable(['a-c', 'b'], '!a-c||c'));
  t.truthy(applicable(['a-c', 'b'], '!c||b'));
  t.truthy(applicable(['a-c', 'b'], '!c||d'));
  t.falsy(applicable(['a-c', 'b'], '!a-c&&b'));
  t.falsy(applicable(['a-c', 'b'], '!a-c&&c'));
  t.truthy(applicable(['a-c', 'b'], '!c&&b'));
  t.falsy(applicable(['a-c', 'b'], '!c&&d'));

  t.truthy(applicable(['a-c', 'b'], '! a-c || b'));
  t.falsy(applicable(['a-c', 'b'], '! a-c || c'));
  t.truthy(applicable(['a-c', 'b'], '! c || b'));
  t.truthy(applicable(['a-c', 'b'], '! c || d'));
  t.falsy(applicable(['a-c', 'b'], '! a-c && b'));
  t.falsy(applicable(['a-c', 'b'], '! a-c && c'));
  t.truthy(applicable(['a-c', 'b'], '! c && b'));
  t.falsy(applicable(['a-c', 'b'], '! c && d'));
});

test('applicable supports parenthesis', t => {
  t.falsy(applicable(['a', 'b', 'c'], 'not a and d'));
  t.truthy(applicable(['a', 'b', 'c'], 'not (a and d)'));

  t.truthy(applicable(['a', 'b', 'c'], 'd && e || c'));
  t.falsy(applicable(['a', 'b', 'c'], 'd &&(e || c)'));
});

test('applicable complains about broken expression', t => {
  t.throws(() => applicable([], 'not (a and c'));
  t.throws(() => applicable([], 'a&&||b'));
});
