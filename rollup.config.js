import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  input: 'lib/index.js',
  external: [
    'fs',
    'path',
    'https',
    'crypto',
    'os',
    'string_decoder',
    'readline',
    'child_process',
    'stream',
    'events',
    'zlib',
    'url',
    'util',
    'constants',
    'buffer'
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    replace({
      delimiters: ['', ''],
      values: {
        'require(\'readable-stream/transform\')': 'require(\'stream\').Transform',
        'require("readable-stream/transform")': 'require(\'stream\').Transform',
        'require(\'readable-stream\')': 'require(\'stream\')',
        'require("readable-stream")': 'require(\'stream\')'
      }
    }),
    commonjs({
      ignore: [ 'conditional-runtime-dependency' ]
    }),
    resolve({preferBuiltins: true}),
  ]
};
