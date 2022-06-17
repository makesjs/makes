import {test} from 'zora';
import pfs from '../lib/possible-feature-selections.js';

test('possibleFeatureSelections returns empty array for empty questions', async t => {
  t.deepEqual(pfs(), []);
  t.deepEqual(pfs([]), []);
});

test('possibleFeatureSelections returns empty array for questions without select', async t => {
  const questions = [
    {
      name: 'name',
      message: '',
      default: 'my-app'
    },
    {
      name: 'description',
      message: '',
      default: ''
    }
  ];
  t.deepEqual(pfs(questions), []);
});

test('possibleFeatureSelections returns possible selections', async t => {
  const questions = [
    {
      name: 'name',
      message: '',
      default: 'my-app'
    },
    {
      choices: [
        { },
        { value: 'b'}
      ]
    },
    {
      choices: [
        { value: 'c' },
        { value: 'd' }
      ]
    }
  ];
  t.deepEqual(pfs(questions), [
    ['c'],
    ['d'],
    ['b', 'c'],
    ['b', 'd']
  ]);
});

test('possibleFeatureSelections returns possible selections with conditions', async t => {
  const questions = [
    {
      choices: [
        { value: 'a' },
        { value: 'b'}
      ]
    },
    {
      if: 'a',
      choices: [
        { value: 'c' },
        { value: 'd' }
      ]
    },
    {
      choices: [
        { value: 'e' },
        { value: 'f', if: 'b' },
        { value: 'g', if: 'd' }
      ]
    },
  ];
  t.deepEqual(pfs(questions), [
    ['a', 'c', 'e'],
    ['a', 'd', 'e'],
    ['a', 'd', 'g'],
    ['b', 'e'],
    ['b', 'f'],
  ]);
});

test('possibleFeatureSelections returns possible selections with conditions, case 2', async t => {
  const questions = [
    {
      choices: [
        { value: 'a' },
        { value: 'b'}
      ]
    },
    {
      choices: [
        { if: 'a', value: 'c' },
        { if: 'a', value: 'd' }
      ]
    },
    {
      choices: [
        { value: 'e' },
        { value: 'f', if: 'b' },
        { value: 'g', if: 'd' }
      ]
    },
  ];
  t.deepEqual(pfs(questions), [
    ['a', 'c', 'e'],
    ['a', 'd', 'e'],
    ['a', 'd', 'g'],
    ['b', 'e'],
    ['b', 'f'],
  ]);
});

test('possibleFeatureSelections returns possible selections with multi-select', async t => {
  const questions = [
    {
      name: 'name',
      message: '',
      default: 'my-app'
    },
    {
      choices: [
        { value: 'a' },
        { value: 'b'}
      ]
    },
    {
      if: 'a',
      choices: [
        { value: 'c' },
        { value: 'd' }
      ]
    },
    {
      name: 'description',
      message: '',
      default: ''
    },
    {
      multiple: true,
      choices: [
        { value: 'e' },
        { value: 'f', if: 'b' },
        { value: 'g', if: 'd' }
      ]
    },
  ];
  t.deepEqual(pfs(questions), [
    ['a', 'c'],
    ['a', 'c', 'e'],
    ['a', 'd'],
    ['a', 'd', 'e', 'g'],
    ['b'],
    ['b', 'e', 'f']
  ]);
});

