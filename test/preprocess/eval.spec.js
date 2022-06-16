const {test} = require('zora');
const preprocess = require('../../lib/preprocess');

test('@eval resolves and evals variable in html syntax', t => {
  t.is(
    preprocess('a/b.html', 'a<!-- @eval FINGERPRINT -->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
  t.is(
    preprocess('a/b.html', 'a<!-- @eval FINGERPRINT.toLowerCase() -->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xdeadbeefc'
  );
});

test('@eval resolves and evals variable (block comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/* @eval FINGERPRINT */c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
  t.is(
    preprocess('a/b.js', 'a/* @eval JSON.stringify(FINGERPRINT) */c', {FINGERPRINT: '0xDEADBEEF'}),
    'a"0xDEADBEEF"c'
  );
});

test('@eval resolves and evals variable (line comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a\n// @eval FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
  t.is(
    preprocess('a/b.js', 'a\n// @eval FINGERPRINT.slice(2, 4)\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\nDE\nc'
  );
});

test('multiple @eval without overreaching in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/* @eval FOO */b/* @eval BAR */c', {FOO: 1, BAR: 2}),
    'a1b2c'
  );
  t.is(
    preprocess('a/b.js', 'a/* @eval FOO + 10 */b/* @eval BAR * 2 */c', {FOO: 1, BAR: 2}),
    'a11b4c'
  );
});

test('@eval allows ommitting of whitespaces before and after @eval in html syntax', t => {
  t.is(
    preprocess('a/b.html', 'a<!--@eval FINGERPRINT-->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
  t.is(
    preprocess('a/b.html', 'a<!--@eval FINGERPRINT + \'#\' -->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEF#c'
  );
});

test('@eval allows ommitting of whitespaces before and after @eval (block comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/*@eval FINGERPRINT*/c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
  t.is(
    preprocess('a/b.js', 'a/*@eval FINGERPRINT.toLowerCase()*/c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xdeadbeefc'
  );
});

test('@eval allows ommitting of whitespaces before and after @eval (line comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a\n//@eval FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
  t.is(
    preprocess('a/b.js', 'a\n//@eval FINGERPRINT + "##" \nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF##\nc'
  );
});

test('@eval complains about broken js syntax', t => {
  t.throws(() => preprocess('a/b.js', 'a\n//@eval FINGERPRINT+\nc', {FINGERPRINT: '0xDEADBEEF'}));
});

test('@eval treats undefined/null/NaN as empty string', t => {
  t.is(
    preprocess('a/b.js', 'a\n//@eval undefined\nc', {}),
    'a\n\nc'
  );
  t.is(
    preprocess('a/b.js', 'a\n//@eval null\nc', {}),
    'a\n\nc'
  );
  // NaN
  t.is(
    preprocess('a/b.js', 'a\n//@eval 0 / 0 \nc', {}),
    'a\n\nc'
  );
});
