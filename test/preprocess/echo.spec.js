import test from 'ava';
import preprocess from '../../lib/preprocess';

test('@echo resolves and echoes variable in html syntax', t => {
  t.is(
    preprocess('a<!-- @echo FINGERPRINT -->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
});

test('@echo resolves and echoes variable (block comment) in js syntax', t => {
  t.is(
    preprocess('a/* @echo FINGERPRINT */c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
});

test('@echo resolves and echoes variable (line comment) in js syntax', t => {
  t.is(
    preprocess('a\n// @echo FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
});

test('multiple @echo without overreaching in js syntax', t => {
  t.is(
    preprocess('a/* @echo FOO */b/* @echo BAR */c', {FOO: 1, BAR: 2}),
    'a1b2c'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo in html syntax', t => {
  t.is(
    preprocess('a<!--@echo FINGERPRINT-->c', {FINGERPRINT: '0xDEADBEEF'}, null, 'html'),
    'a0xDEADBEEFc'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo (block comment) in js syntax', t => {
  t.is(
    preprocess('a/*@echo FINGERPRINT*/c', {FINGERPRINT: '0xDEADBEEF'}),
    'a0xDEADBEEFc'
  );
});

test('@echo allows ommitting of whitespaces before and after @echo (line comment) in js syntax', t => {
  t.is(
    preprocess('a\n//@echo FINGERPRINT\nc', {FINGERPRINT: '0xDEADBEEF'}),
    'a\n0xDEADBEEF\nc'
  );
});
