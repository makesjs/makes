const XRegExp = require('xregexp');
const _ = require('lodash');
const {html, js} = require('./regex-rules');
const applicable = require('../applicable');

function replaceRecursive(rv, rule, cb) {
  const startRegex = new RegExp(rule.start, 'mi');
  const endRegex = new RegExp(rule.end, 'mi');

  function matchReplacePass(content) {
    const matches = XRegExp.matchRecursive(content, rule.start, rule.end, 'gmi', {
      valueNames: ['between', 'left', 'match', 'right']
    });

    const matchGroup = {
      left: null,
      match: null,
      right: null
    };

    return matches.reduce((builder, match) => {
      switch(match.name) {
      case 'between':
        builder += match.value;
        break;
      case 'left':
        matchGroup.left = startRegex.exec(match.value);
        break;
      case 'match':
        matchGroup.match = match.value;
        break;
      case 'right':
        matchGroup.right = endRegex.exec(match.value);
        builder += cb(matchGroup.left, matchGroup.right, matchGroup.match, matchReplacePass);
        break;
      }
      return builder;
    }, '');
  }

  return matchReplacePass(rv);
}

function replace(rv, rule, cb) {
  const isRegex = typeof rule === 'string' || rule instanceof RegExp;
  const isArray = Array.isArray(rule);

  if (isRegex) {
    rule = [new RegExp(rule,'gmi')];
  } else if (isArray) {
    rule = rule.map(r => new RegExp(r,'gmi'));
  }

  return rule.reduce((rv, rule) => rv.replace(rule, cb), rv);
}

// properties is like {name: 'app-name', foo: 'lorem'}
// features is like   ['aurelia', 'typescript', 'jest']
module.exports = function(source, properties, features, mode) {
  const rules = mode === 'html' ? html : js;
  // normalize line break
  let rv = source.replace(/(?:\r\n)|\r/g, '\n');

  rv = replaceRecursive(rv, rules.if, (startMatches, endMatches, include, recurse) =>
    applicable(features, startMatches[1].trim()) ? recurse(include) : ''
  );

  rv = replace(rv, rules.echo, (match, variable) => _.get(properties, variable.trim()));
  return rv;
};