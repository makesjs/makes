const test = require('ava');
const makes = require('../lib/index');
const prompts = require('../lib/prompts');
const mockfs = require('mock-fs');

test.afterEach(() => {
  mockfs.restore();
});

test('exports some functions', t => {
  t.is(typeof makes.getOpts, 'function');
  t.is(typeof makes.prompts.text, 'function');
  t.is(typeof makes.prompts.select, 'function');
  t.is(typeof makes.possibleFeatureSelections, 'function');
});

test.serial('makes complains missing project name in silent mode', async t => {
  mockfs();

  await t.throwsAsync(async () => makes('supplier', {
    predefinedProperties: {},
    unattended: true
  }));
});

test.serial('makes checks target folder', async t => {
  let captured;

  mockfs();

  await makes('supplier', {
    predefinedProperties: {name: 'app'},
    unattended: true
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      nameQuestion: {
        name: 'name',
        message: 'Name:'
      },
      questions: [
        {
          message: 'lorem',
          choices: [
            {value: 'a', title: 'A'},
            {value: 'b', title: 'B'}
          ]
        }
      ],
      prependTransforms: 'mock-prepend',
      appendTransforms: 'mock-append'
    }),
    _writeProject: result => {
      captured = result;
    }
  });

  t.deepEqual(captured, {
    properties: {name: 'app'},
    features: ['a'],
    skeletonDir: 'skeleton',
    targetDir: 'app',
    unattended: true,
    prependTransforms: 'mock-prepend',
    appendTransforms: 'mock-append'
  });
});

test.serial('makes rejects existing folder', async t => {
  let captured;

  mockfs({app: {}});

  await t.throwsAsync(async () => makes('supplier', {
    predefinedProperties: {name: 'app'},
    unattended: true
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      nameQuestion: {
        name: 'name',
        message: 'Name:'
      },
      questions: []
    }),
    _writeProject: result => {
      captured = result;
    }
  }));

  t.is(captured, undefined);
});

test.serial('makes writes to existing folder with --here', async t => {
  let captured;

  mockfs();

  await makes('supplier', {
    predefinedProperties: {name: 'app'},
    unattended: true,
    here: true
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      nameQuestion: {
        name: 'name',
        message: 'Name:'
      },
      questions: [
        {
          message: 'lorem',
          choices: [
            {value: 'a', title: 'A'},
            {value: 'b', title: 'B'}
          ]
        }
      ],
      prependTransforms: 'mock-prepend',
      appendTransforms: 'mock-append'
    }),
    _writeProject: result => {
      captured = result;
    }
  });

  t.deepEqual(captured, {
    properties: {name: 'app'},
    features: ['a'],
    skeletonDir: 'skeleton',
    targetDir: '.',
    unattended: true,
    prependTransforms: 'mock-prepend',
    appendTransforms: 'mock-append'
  });
});

test.serial('makes supports "before" task to change conditions', async t => {
  let captured;

  mockfs();

  await makes('supplier', {
    predefinedProperties: {},
    preselectedFeatures: ['a'],
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      nameQuestion: {
        name: 'name',
        message: 'Name:'
      },
      questions: [
        {
          name: 'description',
          message: 'Description'
        },
        {
          message: 'lorem',
          choices: [
            {value: 'a', title: 'A'},
            {value: 'b', title: 'B'}
          ]
        }
      ],
      prependTransforms: 'mock-prepend',
      appendTransforms: 'mock-append',
      before: opts => {
        t.falsy(opts.here);
        t.is(typeof opts.prompts.select, 'function');
        t.is(typeof opts.ansiColors.red, 'function');
        t.is(typeof opts.sisteransi.cursor.to, 'function');
        return {
          silentQuestions: true,
          preselectedFeatures: ['b'],
          predefinedProperties: {...opts.predefinedProperties, description: 'hello'}
        };
      }
    }),
    _writeProject: result => {
      captured = result;
    },
    _runQuestionnaire: (questions, {unattended, preselectedFeatures, predefinedProperties}) => {
      if (questions.length === 1 && questions[0].name === 'name') {
        return [{name: 'app'}];
      } else if (unattended) {
        return [predefinedProperties, preselectedFeatures];
      } else {
        t.fail('should not get here');
      }
    }
  });

  t.deepEqual(captured, {
    properties: {name: 'app', description: 'hello'},
    features: ['b'],
    skeletonDir: 'skeleton',
    targetDir: 'app',
    unattended: false,
    prependTransforms: 'mock-prepend',
    appendTransforms: 'mock-append'
  });
});

test.serial('makes supports "after" task', async t => {
  let captured, captured2;

  mockfs();

  await makes('supplier', {
    predefinedProperties: {name: 'app'},
    preselectedFeatures: ['b'],
    unattended: true
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      nameQuestion: {
        name: 'name',
        message: 'Name:'
      },
      questions: [
        {
          name: 'description',
          message: 'Description'
        },
        {
          message: 'lorem',
          choices: [
            {value: 'a', title: 'A'},
            {value: 'b', title: 'B'}
          ]
        }
      ],
      prependTransforms: 'mock-prepend',
      appendTransforms: 'mock-append',
      before: () => {}, // do nothing
      after: opts => {
        captured2 = opts;
      }
    }),
    _writeProject: result => {
      captured = result;
    }
  });

  t.deepEqual(captured, {
    properties: {name: 'app', description: ''},
    features: ['b'],
    skeletonDir: 'skeleton',
    targetDir: 'app',
    unattended: true,
    prependTransforms: 'mock-prepend',
    appendTransforms: 'mock-append'
  });

  t.deepEqual(captured2.properties, {name: 'app', description: ''});
  t.deepEqual(captured2.features, ['b']);
  t.falsy(captured2.here);
  t.deepEqual(captured2.notDefaultFeatures, ['b']);
  t.is(typeof captured2.ansiColors.red, 'function');
  t.is(typeof captured2.sisteransi.cursor.to, 'function');
  t.true(captured2.unattended);
  t.is(captured2.prompts, prompts);
  t.is(typeof captured2.run, 'function');
});
