import test from 'ava';
import makes from '../lib/index';
import prompts from '../lib/prompts';
import mockfs from 'mock-fs';

test.afterEach(() => {
  mockfs.restore();
});

test('exports getOpts func', t => {
  t.is(typeof makes.getOpts, 'function');
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
      questions: [
        {
          name: 'name',
          message: 'Name:'
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
      questions: [
        {
          name: 'name',
          message: 'Name:'
        }
      ]
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
      questions: [
        {
          name: 'name',
          message: 'Name:'
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
    predefinedProperties: {name: 'app'},
    preselectedFeatures: ['a'],
  }, {
    _skeletonDir: () => 'skeleton',
    _skeletonConfig: () => ({
      questions: [
        {
          name: 'name',
          message: 'Name:'
        },
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
        t.is(typeof opts.prompts.select, 'function');
        return {
          unattended: true,
          preselectedFeatures: ['b'],
          predefinedProperties: {...opts.predefinedProperties, description: 'hello'}
        };
      }
    }),
    _writeProject: result => {
      captured = result;
    }
  });

  t.deepEqual(captured, {
    properties: {name: 'app', description: 'hello'},
    features: ['b'],
    skeletonDir: 'skeleton',
    targetDir: 'app',
    unattended: true,
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
      questions: [
        {
          name: 'name',
          message: 'Name:'
        },
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
  t.deepEqual(captured2.notDefaultFeatures, ['b']);
  t.true(captured2.unattended);
  t.is(captured2.prompts, prompts);
  t.is(typeof captured2.run, 'function');
});
