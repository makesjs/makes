module.exports = function (wallaby) {
  return {
    files: [
      'lib/**/*.js',
      'test/**/*',
      { pattern: 'test/**/*.spec.js', ignore: true }
    ],

    tests: [
      'test/**/*.spec.js'
    ],

    testFramework: 'ava',

    env: {
      type: 'node',
      runner: 'node'
    }
  };
};
