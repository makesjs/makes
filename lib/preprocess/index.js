const { codeFrameColumns } = require('@babel/code-frame');
const {html, js} = require('./regex-rules');
const applicable = require('../applicable');
const { warn } = require('../log');

class Token {
  constructor(start, end, value) {
    this.start = start;
    this.end = end;
    this.value = value;
  }
}

class MatchToken extends Token {
  constructor(match) {
    super(match.index, match.index + match[0].length, match[0]);
  }
}

class StartMatchToken extends MatchToken {
  constructor(match) {
    super(match);
    this.expression = match[1];
  }
}

class EndMatchToken extends MatchToken {
  constructor(match) {
    super(match);
  }
}

function replaceRecursive(rv, rule, cb) {
  const startRegex = new RegExp(rule.start, 'gmi');
  const endRegex = new RegExp(rule.end, 'gmi');
  const tokens = [];
  let m;

  while ((m = startRegex.exec(rv)) !== null) {
    tokens.push(new StartMatchToken(m));
  }

  while ((m = endRegex.exec(rv)) !== null) {
    tokens.push(new EndMatchToken(m));
  }

  tokens.sort((a, b) => a.start - b.start);

  // Fill up in-between tokens
  let end = rv.length;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    if (token.end < end) {
      tokens.splice(i + 1, 0, new Token(token.end, end, rv.slice(token.end, end)));
    }
    end = token.start;
  }

  if (!tokens.length) {
    tokens.unshift(new Token(0, rv.length, rv));
  } else if (tokens[0].start > 0) {
    tokens.unshift(new Token(0, tokens[0].start, rv.slice(0, tokens[0].start)));
  }

  // Fill up line/column for error print
  let lastLine = 1, lastColumn = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const loc = {
      start: {
        line: lastLine,
        column: lastColumn
      }
    };
    for (let c of token.value) {
      if (c === '\n') { // only support \r\n or \n
        lastLine += 1;
        lastColumn = 0;
      } else {
        lastColumn += 1;
      }
    }
    loc.end = {
      line: lastLine,
      column: lastColumn
    };
    token.loc = loc;
  }

  function matchReplacePass(tokens) {
    let depth = 0;
    let start = null;
    let inside = [];
    let builder = '';
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token instanceof StartMatchToken) {
        if (depth === 0) {
          // Found first @if
          start = token;
        } else {
          inside.push(token);
        }
        depth += 1;
      } else if (token instanceof EndMatchToken) {
        if (depth === 0) {
          throw new Error(
            'Could not find a starting @if for the @endif\n' +
            codeFrameColumns(rv, token.loc)
          );
        } else if (depth === 1) {
          // Got a pair
          builder += cb(start.expression, inside, matchReplacePass);
          // Reset
          start = null;
          inside = [];
        } else {
          inside.push(token);
        }
        depth -= 1;
      } else {
        if (depth === 0) {
          // in-between
          builder += token.value;
        } else {
          // inside a pair
          inside.push(token);
        }
      }
    }

    if (depth > 0) {
      throw new Error(
        'Could not find an ending @endif for the @if\n' +
        codeFrameColumns(rv, start.loc)
      );
    }

    return builder;
  }

  return matchReplacePass(tokens);
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

function dangerousEval(expression, properties) {
  const wrapped = `with (properties) { return (${expression}); }`;

  try {
    // eslint-disable-next-line no-new-func
    const result = (new Function('properties', wrapped))(properties);
    if (result && result.toString) {
      return result.toString();
    }
    return '';
  } catch (e) {
    throw new Error(`Eval expression: ${expression} error:${e.message}`);
  }
}

// properties is like {name: 'app-name', foo: 'lorem'}
// features is like   ['aurelia', 'typescript', 'jest']
module.exports = function(filePath, source, properties, features, mode) {
  const rules = mode === 'html' ? html : js;
  // normalize line break
  let rv = source.replace(/(?:\r\n)|\r/g, '\n');

  rv = replaceRecursive(rv, rules.if, (expression, inside, recurse) =>
    applicable(features, expression) ? recurse(inside) : ''
  );

  rv = replace(rv, rules.echo, (_, variable) => {
    if (properties.hasOwnProperty(variable)) {
      return properties[variable] || '';
    } else {
      warn(`Property "${variable}" is not defined for use in @echo in template ${filePath}`);
      return '';
    }
  });
  rv = replace(rv, rules.eval, (_, expression) => dangerousEval(expression, properties));

  return rv;
};
