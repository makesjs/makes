import test from 'ava';
import preprocess from '../../lib/preprocess';

test('@if works in html syntax', t => {
  const source = `a
<!-- @if foo -->
b
<!-- @endif -->
c`;

  t.is(preprocess(source, null, ['foo'], 'html'), 'a\nb\nc');
  t.is(preprocess(source, null, ['bar'], 'html'), 'a\nc');
});

test('@if complains about missing ending in html syntax', t => {
  const source = `a
<!-- @if foo -->
b
<!-- endif -->
c`;

  t.throws(() => preprocess(source, null, ['foo'], 'html'));
  t.throws(() => preprocess(source, null, ['bar'], 'html'));
});

test('@if works in html syntax with hidden syntax', t => {
  const source = `a
<!-- @if foo !>
b
<!-- @endif -->
c`;

  t.is(preprocess(source, null, ['foo'], 'html'), 'a\nb\nc');
  t.is(preprocess(source, null, ['bar'], 'html'), 'a\nc');
});

test('@if complains about missing ending in html syntax with hidden syntax', t => {
  const source = `a
<!-- @if foo !>
b
<!-- endif -->
c`;

  t.throws(() => preprocess(source, null, ['foo'], 'html'));
  t.throws(() => preprocess(source, null, ['bar'], 'html'));
});

test('@if supports nested condition in html syntax', t => {
  const source = `a
<!-- @if foo -->
b
<!-- @if bar and xx -->
d
<!-- @if lo !>
e
<!-- @endif -->
<!-- @endif -->
<!-- @if xx !>
f
<!-- @endif -->
<!-- @endif -->
c`;

  t.is(preprocess(source, null, ['foo', 'xx', 'bar'], 'html'), 'a\nb\nd\nf\nc');
  t.is(preprocess(source, null, ['bar'], 'html'), 'a\nc');
  t.is(preprocess(source, null, ['foo', 'xx', 'bar', 'lo'], 'html'), 'a\nb\nd\ne\nf\nc');
});

test('@if works in js syntax', t => {
  const source = `a
// @if foo
b
// @endif
c`;

  t.is(preprocess(source, null, ['foo']), 'a\nb\nc');
  t.is(preprocess(source, null, ['bar']), 'a\nc');
});

test('@if complains about missing ending in js syntax', t => {
  const source = `a
// @if foo
b
// endif
c`;

  t.throws(() => preprocess(source, null, ['foo']));
  t.throws(() => preprocess(source, null, ['bar']));
});

test('@if works in js syntax with hidden syntax (block comment)', t => {
  const source = `a
/* @if foo **
b
/* @endif */
c`;

  t.is(preprocess(source, null, ['foo']), 'a\n\nb\n\nc');
  t.is(preprocess(source, null, ['bar']), 'a\n\nc');
});

test('@if complains about missing ending in js syntax with hidden syntax (block comment)', t => {
  const source = `a
/* @if foo **
b
/* endif */
c`;

  t.throws(() => preprocess(source, null, ['foo']));
  t.throws(() => preprocess(source, null, ['bar']));
});

test('@if supports one line block comment in js syntax', t => {
  const source = 'a/* @if foo */b/* @endif */c';
  t.is(preprocess(source, null, ['foo']), 'abc');
  t.is(preprocess(source, null, ['bar']), 'ac');
});

test('@if supports nesting (block comment) in js syntax', t => {
  const source = 'a /* @if foo */b/* @if bar */bad/* @endif */ c/* @if foo */d/* @endif */e/* @endif */f';
  t.is(preprocess(source, null, ['foo']), 'a b cdef');
  t.is(preprocess(source, null, ['bar']), 'a f');
  t.is(preprocess(source, null, ['foo', 'bar']), 'a bbad cdef');
});

test('@if supports nested condition in js syntax', t => {
  const source = `a
// @if foo
b
// @if bar && xx
d/* @if lo */
e/* @endif */
// @endif
/* @if xx **f/* @endif */
// @endif
c`;

  t.is(preprocess(source, null, ['foo', 'xx', 'bar']), 'a\nb\nd\nf\nc');
  t.is(preprocess(source, null, ['bar']), 'a\nc');
  t.is(preprocess(source, null, ['foo', 'xx', 'bar', 'lo']), 'a\nb\nd\ne\nf\nc');
});
