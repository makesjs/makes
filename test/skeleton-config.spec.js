const test = require('ava');
const config = require('../lib/skeleton-config');
const mockfs = require('mock-fs');

test.afterEach(() => {
  mockfs.restore();
});

test.serial('skeletonConfig runs npm install when required', async t => {
  mockfs({
    'skeleton/package.json': '{"dependencies":{"foo":"1.0.0"}}'
  });

  let installed;
  function npmInstall(dir) {
    installed = dir;
  }

  const result = await config('skeleton', {
    _npmInstall: npmInstall,
    _import: async () => undefined
  });
  t.truthy(installed);

  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig does not run npm install when node_modules exists', async t => {
  mockfs({
    'skeleton/package.json': '{"dependencies":{"foo":"1.0.0"}}',
    'skeleton/node_modules': {}
  });

  let installed;
  function npmInstall(dir) {
    installed = dir;
  }

  const result = await config('skeleton', {
    _npmInstall: npmInstall,
    _import: async () => undefined
  });
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig does not run npm install for devDependencies', async t => {
  mockfs({
    'skeleton/package.json': '{"devDpendencies":{"foo":"1.0.0"}}'
  });

  let installed;
  function npmInstall(dir) {
    installed = dir;
  }

  const result = await config('skeleton', {
    _npmInstall: npmInstall,
    _import: async () => undefined
  });
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig skip npm install when not required', async t => {
  mockfs({
    'skeleton/package.json': '{}'
  });

  let installed;
  function npmInstall(dir) {
    installed = dir;
  }

  const result = await config('skeleton', {
    _npmInstall: npmInstall,
    _import: async () => undefined
  });
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig skip npm install when no packge.json', async t => {
  mockfs({
    'skeleton/.keep': ''
  });

  let installed;
  function npmInstall(dir) {
    installed = dir;
  }

  const result = await config('skeleton', {
    _npmInstall: npmInstall,
    _import: async () => undefined
  });
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig reads questions, and transforms', async t => {
  mockfs({
    'skeleton/.keep': ''
  });

  async function mockImport(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/questions') {
      return {
        'default': [
          {name: 'description', message: 'Des'},
          {choices: [{value: 'one'}], message: 'Choose'}
        ]
      };
    } else if (m === 'skeleton/transforms') {
      return {
        prepend: 'fake',
        append: ['fake2', 'fake3']
      };
    }
  }


  const result = await config('skeleton', {_import: mockImport});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [
      {name: 'description', message: 'Des'},
      {choices: [{value: 'one'}], message: 'Choose'}
    ],
    prependTransforms: ['fake'],
    appendTransforms: ['fake2', 'fake3'],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig does not inject question for project name if user provided one', async t => {
  mockfs({
    'skeleton/.keep': ''
  });

  async function mockImport(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/questions') {
      return {
        'default': [
          {name: 'name', message: 'Name'},
          {name: 'description', message: 'Des'},
          {choices: [{value: 'one'}], message: 'Choose'}
        ]
      };
    }
  }

  const result = await config('skeleton', {_import: mockImport});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {name: 'name', message: 'Name', default: 'my-app'},
    questions: [
      {name: 'description', message: 'Des'},
      {choices: [{value: 'one'}], message: 'Choose'}
    ],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: undefined,
    after: undefined
  });
});

test.serial('skeletonConfig reads before and after tasks', async t => {
  mockfs({
    'skeleton/.keep': ''
  });

  function mockImport(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/before') {
      return { 'default': 'before' };
    } else if (m === 'skeleton/after') {
      return { 'default': 'after' };
    }
  }


  const result = await config('skeleton', {_import: mockImport});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: undefined,
    before: 'before',
    after: 'after'
  });
});

test.serial('skeletonConfig reads banner', async t => {
  mockfs({
    'skeleton/banner': 'lorem'
  });

  const result = await config('skeleton', {_import: async () => undefined});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dot(.), dash(-) and underscore(_).');
  t.deepEqual(result, {
    nameQuestion: {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app'
    },
    questions: [],
    prependTransforms: [],
    appendTransforms: [],
    banner: 'lorem',
    before: undefined,
    after: undefined
  });
});
