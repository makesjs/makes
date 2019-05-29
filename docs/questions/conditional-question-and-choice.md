---
layout: default
title: Conditional Question and Choice
nav_order: 6
description: Learn how to conditionally run a question or choice
permalink: /questions/conditional
parent: Questions
---

# Conditional Question and Choice
{: .no_toc }

1. TOC
{:toc}

## Conditional question

There are two conditional questions in [`makesjs/demo2` `questions.js`](https://github.com/makesjs/demo2/blob/master/questions.js). Just add an `if` with a condition expression.

```js
module.exports = [
  // ...
  {
    if: 'license',
    name: 'author',
    message: "What's the author name to be displayed in MIT license?",
    // optional validation (only for text prompt)
    // if return value is an non-empty string, or boolean false, it's considered failed.
    validate: value => {
      if (!value.trim()) return 'Author is mandatory for license'
    }
  },
  // single-select, but only when user selected "nodejs"
  {
    if: 'nodejs',
    message: 'Do you want to use a transpiler?',
    choices: [
      // first choice has no value, means it wouldn't add any value to answers.
      // hint is an optional field for detailed explanation.
      {title: 'None', hint: 'Write plain commonjs code.'},
      {value: 'babel', title: 'Babel for ESNext', hint: 'Use next generation JavaScript, today.'},
      {value: 'typescript', title: 'TypeScript', hint: 'TypeScript is a typed superset of Javascript that compiles to plain JavaScript.'}
    ]
  }
];
```

The text prompt for license author will only appear if end user picked `license` from previous select prompt. The select prompt for transpiler will only appear if end user picked `nodejs` before.

## Condition expression

The expression `'license'` and `'nodejs'` are the simplest form of conditional expression.

You can use rich logic in conditional expression with the help of `and` or `&&`, `or` or `||`, `not` or `!`, as well as `(` and `)`.

For example,
```
'nodejs && license'
'jest or jasmine'
'not webpack and requirejs'
'!webpack && requirejs'
'a && (b || c)'
```

The expression looks like JavaScript expression, but they are not. Remember we support dash(`-`) in choice value string. That means following are valid condition expression in "makes", but they have different meaning in JavaScript expression (`-` is an operator in JavaScript).

```
'vue-sfc'
'babel && vue-sfc'
```

The condition expression is used for conditional question/choice/file/folder, plus the condition inside file content preprocess. All these conditions are evaluated through the same [tiny expression engine](https://github.com/makesjs/makes/blob/master/lib/applicable.js), you will see the familiarity when you read other topics.

## Conditional choice

Condition on choice is same, just add `if: 'express'` to any choice. There is no example in `makesjs/demo2`, but you can find plenty in [`dumberjs/new` `questions.js`](https://github.com/dumberjs/new/blob/master/questions.js).

