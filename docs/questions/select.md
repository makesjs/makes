---
layout: default
title: Select Prompt
nav_order: 2
description: Learn how to define select prompt
permalink: /questions/select
parent: Questions
---

# Select Prompt
{: .no_toc }

1. TOC
{:toc}

## Message and choices

The first select prompt in [`3cp/makes-demo2` `questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js):

```js
module.exports = [
  // ...
  {
    message: 'What type of project?',
    choices: [
      {value: 'nodejs', title: 'Node.js'},
      {value: 'ruby', title: 'Ruby'}
    ]
  }
  // ...
];
```

![select prompt1]({{ site.baseurl }}/assets/select-prompt1.png)

Same as text prompt, you need to provide a `message` for user to read, plus a list of choices. Every choice can have:

1. `value`: (optional) a string value, invisible to end user.
  * you can only use letters, numbers, and dash(`-`) in value string.
  * underscore(`_`) is not permitted, because it's a char to be used in condition expression part of file/folder name. We will explain in [conditional file](../conditional-file).
2. `title`: what end user will read on screen.
3. `hint`: (optional) additional explanation for end user to read on screen.

Example of choices with hints:
```js
module.exports = [
  // ...
  {
    message: 'What type of project?',
    choices: [
      {value: 'nodejs', title: 'Node.js', hint: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.'},
      {value: 'ruby', title: 'Ruby', hint: 'A dynamic, open source programming language with a focus on simplicity and productivity.'}
    ]
  }
  // ...
];
```

![select prompt2]({{ site.baseurl }}/assets/select-prompt2.png)

## No name needed

Different from all popular prompts, [inquirer](https://github.com/SBoudrias/Inquirer.js), [enquirer](https://github.com/enquirer/enquirer), and [prompts](https://github.com/terkelg/prompts), our select prompt doesn't need `name`.

While other popular select prompt returns an object like:

```
{ "name-of-the-select": "selected-value" }
```

We simply return `"selected-value"` or `undefined` (if user selected a choice with no value).

## Features array

All answers from select/multi-select prompt questions are merged together into an array internally called `features`. For example, when end user selected `nodejs` and `babel` from two different select prompts, the `features` array becomes:

```js
['nodejs', 'babel']
```

If end user selected a choice with no value or a value of empty string, "makes" will not add anything into the `features` array.

This simplification means **all non-empty choice values among all select/multi-select prompts must be unique**.

The `features` array is essential to conditional question/choice/file/content, which we will explain in related topics.

## Conventional default answer

Select prompt doesn't support `default`. For simplicity, the default answer of a select prompt is always the value of first available (after conditional filtering) choice. If there is no value on first available choice, the default value is `undefined`.
