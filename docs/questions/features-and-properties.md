---
layout: default
title: Features and Properties
nav_order: 5
description: Learn how "makes" makes use of the answers from questions
permalink: /questions/features-and-properties
parent: Questions
---

# Features and Properties
{: .no_toc }

1. TOC
{:toc}

Before we show you conditional questions and choice, we have to understand how "makes" makes use of the answers from questions.

"makes" divides the answers into two groups.
1. the answers from text prompts were grouped into a hash object called `properties`.
2. the answers from select/multi-select prompts are grouped into an array called `features`.
3. `properties` and `features` were built progressively when end user went through the questions, so we can use `features` to conditionally control the appearance of next question and choice of select prompt.

Take [`makesjs/demo2` `questions.js`](https://github.com/makesjs/demo2/blob/master/questions.js) for example, "makes" will form `properties` and `features` like this:

```js
var properties = {
  name: 'my-app',
  description: '',
  author: 'CP'
};

var features = [ 'nodejs', 'gitignore', 'license', 'babel' ];
```

## Properties

The `properties` from text prompts are only useful for `@echo` and `@eval` in [preprocess content](../preprocess-content).

```js
/* @echo name */
var desc = /* @eval JSON.stringify(description) */;
```

Be careful, `@echo` does not automatically escape the string in any situation, we can use `@eval` to help escaping. We will explain more in [preprocess content](../preprocess-content).

## Features

The `features` array from answers of select/multi-select prompts have much wider usage in "makes", it serves as the **basis of any conditional logic**. You can conditionally show questions, choices, files, part of file contents based on end user's selected `features`.

## Boolean Prompt or Checkbox

Note "makes" doesn't provide any boolean/checkbox prompt. To do a "yes/no" question, just use a select prompt.

```
{
  message: 'Do you want to use PostCSS?',
  choices: [
    {title: 'No'},
    {value: 'postcss', title: 'Yes'}
  ]
}
```

Please don't use string like `"yes"`, `"no"`, `"true"`, `"false"` in choice values. Because "makes" select prompt's answer is not labelled, `"yes"` and `"no"` are not readable in `features` array.

1. use missing value for 'No' branch. When end user selected 'No', it adds nothing to `features` array.
2. use readable string like `'postcss'` in 'Yes' branch.
