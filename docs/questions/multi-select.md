---
layout: default
title: Multi-select Prompt
nav_order: 3
description: Learn how to define multi-select prompt
permalink: /questions/multi-select
parent: Questions
---

# Multi-select Prompt
{: .no_toc }

1. TOC
{:toc}

## Multiple and choices

The multi-select prompt in [`3cp/makes-demo2` `questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js):

```js
module.exports = [
  // ...
  {
    multiple: true,
    message: 'Do you want some common files?',
    choices: [
      {value: 'gitignore', selected: true, title: '.gitignore'},
      {value: 'gitattributes', selected: true, title: '.gitattributes', hint: '.gitattributes file to normalize EOL char on win32.'},
      {value: 'license', title: 'LICENSE (MIT)'}
    ]
  }
  // ...
];
```

![multi-select prompt1]({{ site.baseurl }}/assets/multi-select-prompt1.png)

The multi-select prompt is almost same as a normal select prompt, with one extra field `multiple: true`.

The shape of the choices is also same, with one extra optional field `selected`, which affects default answer. Multi-select also requires every choice with a non-empty value, because a missing value doesn't make any sense in multi-select.

## Shape of answer

While normal select prompt returns a string or `undefined`, multi-select prompt always returns an array.

1. When end user selected zero choice, the answer is an empty array.
2. When end user selected one or more choices, the answer is array of those values.

## Flat features array

The answer of multi-select is flattened in `fetures` array. For example, if `features` array is `['a']`, then a multi-select returns answer `['b', 'c']`, the `features` array is updated to `['a', 'b', 'c']` (not `['a', ['b', 'c']]`).

## Default answer

The default answer of a regular multi-select is an empty array. But you can turn on `selected: true` on some choices to mark default answer.

The default answer for the example multi-select above is `['gitignore', 'gitattributes']`.
