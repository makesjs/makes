import test from 'ava';
import getOpts from '../lib/get-opts';

function mockExit(func) {
  const oldExit = process.exit;

  process.exit = (code = 0) => {
    throw new Error('mock-exit:' + code);
  };

  try {
    const result = func();
    process.exit = oldExit;
    return result;
  } catch (e) {
    process.exit = oldExit;
    throw e;
  }
}

test('getOpts exits after printing help', t => {
  t.throws(() => mockExit(() => getOpts(['--help'])), {message: 'mock-exit:0'});
  t.throws(() => mockExit(() => getOpts(['what', 'ever', '--help'])), {message: 'mock-exit:0'});
  t.throws(() => mockExit(() => getOpts(['what', '--help', 'ever'])), {message: 'mock-exit:0'});
  t.throws(() => mockExit(() => getOpts(['-h'])), {message: 'mock-exit:0'});
  t.throws(() => mockExit(() => getOpts(['what', 'ever', '-h'])), {message: 'mock-exit:0'});
  t.throws(() => mockExit(() => getOpts(['what', '-h', 'ever'])), {message: 'mock-exit:0'});
});

test('getOpts fails when skeleton repo is not provided', t => {
  t.throws(() => mockExit(() => getOpts([])), {message: 'mock-exit:1'});
  t.throws(() => mockExit(() => getOpts(['-s', 'a,b'])), {message: 'mock-exit:1'});
});

test('getOpts gets supplier', t => {
  t.deepEqual(getOpts(['a']), {
    supplier: 'a',
    predefinedProperties: {},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['bitbucket:name/a']), {
    supplier: 'bitbucket:name/a',
    predefinedProperties: {},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['./a']), {
    supplier: './a',
    predefinedProperties: {},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['../a/b']), {
    supplier: '../a/b',
    predefinedProperties: {},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });
});

test('getOpts gets preselected features, set unattended', t => {
  t.deepEqual(getOpts(['a', '-s', 'x']), {
    supplier: 'a',
    predefinedProperties: {},
    preselectedFeatures: ['x'],
    unattended: true,
    here: false
  });

  t.deepEqual(getOpts(['--select', 'x,y', 'bitbucket:name/a']), {
    supplier: 'bitbucket:name/a',
    predefinedProperties: {},
    preselectedFeatures: ['x', 'y'],
    unattended: true,
    here: false
  });

  t.deepEqual(getOpts(['./a', '--select=x:y:z']), {
    supplier: './a',
    predefinedProperties: {},
    preselectedFeatures: ['x', 'y', 'z'],
    unattended: true,
    here: false
  });

  t.deepEqual(getOpts(['-s', 'x y z', '../a/b']), {
    supplier: '../a/b',
    predefinedProperties: {},
    preselectedFeatures: ['x', 'y', 'z'],
    unattended: true,
    here: false
  });
});

test('getOpts gets predefined properties', t => {
  t.deepEqual(getOpts(['a', 'app']), {
    supplier: 'a',
    predefinedProperties: {name: 'app'},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['bitbucket:name/a', 'app', '--foo-bar', 'loo']), {
    supplier: 'bitbucket:name/a',
    predefinedProperties: {name: 'app', 'foo-bar': 'loo', 'fooBar': 'loo'},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['./a', '--fooBar', 'loo', 'app']), {
    supplier: './a',
    predefinedProperties: {name: 'app', fooBar: 'loo'},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });

  t.deepEqual(getOpts(['--fooBar', 'loo', '../a/b']), {
    supplier: '../a/b',
    predefinedProperties: {fooBar: 'loo'},
    preselectedFeatures: [],
    unattended: false,
    here: false
  });
});

test('getOpts gets here mode', t => {
  t.deepEqual(getOpts(['a', 'app', '--here']), {
    supplier: 'a',
    predefinedProperties: {name: 'app'},
    preselectedFeatures: [],
    unattended: false,
    here: true
  });

  t.deepEqual(getOpts(['a', '--here', 'app', '-s=x,y']), {
    supplier: 'a',
    predefinedProperties: {name: 'app'},
    preselectedFeatures: ['x', 'y'],
    unattended: true,
    here: true
  });
});

