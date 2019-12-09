import test from 'ava';
import config from '../lib/skeleton-config';
import mockfs from 'mock-fs';

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

  const result = await config('skeleton', {_npmInstall: npmInstall});
  t.truthy(installed);

  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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

  const result = await config('skeleton', {_npmInstall: npmInstall});
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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

  const result = await config('skeleton', {_npmInstall: npmInstall});
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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

  const result = await config('skeleton', {_npmInstall: npmInstall});
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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

  const result = await config('skeleton', {_npmInstall: npmInstall});
  t.falsy(installed);
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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
    'skeleton/questions.js': '',
    'skeleton/transforms.js': ''
  });

  function mockRequire(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/questions.js') {
      return [
        {name: 'description', message: 'Des'},
        {choices: [{value: 'one'}], message: 'Choose'}
      ];
    } else if (m === 'skeleton/transforms.js') {
      return {
        prepend: 'fake',
        append: ['fake2', 'fake3']
      };
    }
  }


  const result = await config('skeleton', {_require: mockRequire});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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
    'skeleton/questions.js': '',
    'skeleton/transforms.js': ''
  });

  function mockRequire(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/questions.js') {
      return [
        {name: 'name', message: 'Name'},
        {name: 'description', message: 'Des'},
        {choices: [{value: 'one'}], message: 'Choose'}
      ];
    } else if (m === 'skeleton/transforms.js') {
      return {
      };
    }
  }

  const result = await config('skeleton', {_require: mockRequire});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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
    'skeleton/before.js': '',
    'skeleton/after.js': ''
  });

  function mockRequire(m) {
    m = m.replace(/\\/g, '/');
    if (m === 'skeleton/before.js') {
      return 'before';
    } else if (m === 'skeleton/after.js') {
      return 'after';
    }
  }


  const result = await config('skeleton', {_require: mockRequire});
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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

  const result = await config('skeleton');
  const {validate} = result.nameQuestion;
  delete result.nameQuestion.validate;

  t.is(validate('ab-1_2'), null);
  t.is(validate(' a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
  t.is(validate('@a'), 'Please only use letters, numbers, dash(-) and underscore(_).');
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
