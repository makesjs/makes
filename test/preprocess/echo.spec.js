const {test} = require('zora');
const preprocess = require('../../lib/preprocess');

test('preprocess can handle empty input', t => {
  t.is(preprocess('a/b.html', '', {}, null, 'html'), '');
  t.is(preprocess('a/b.js', '', {}, null), '');
});

test('@echo resolves and echoes variable in html syntax', t => {
  t.is(
    preprocess('a/b.html', 'a<!-- @echo FINGERPRINT -->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
});

test('@echo resolves and echoes variable (block comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/* @echo FINGERPRINT */c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
});

test('@echo resolves and echoes variable (line comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a\n// @echo FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
});

test('multiple @echo without overreaching in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/* @echo FOO */b/* @echo BAR */c', {FOO: 1, BAR: 2}),
    'a1b2c'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo in html syntax', t => {
  t.is(
    preprocess('a/b.html', 'a<!--@echo FINGERPRINT-->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo (block comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a/*@echo FINGERPRINT*/c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo (line comment) in js syntax', t => {
  t.is(
    preprocess('a/b.js', 'a\n//@echo FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
});

test('@echo shows missing property as empty string', t => {
  t.is(
    preprocess('a/b.js', 'a/*@echo FINGERPRINT*/c', {}),
    'ac'
  );
});
