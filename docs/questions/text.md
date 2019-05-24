---
layout: default
title: Text Prompt
nav_order: 1
description: Learn how to define text prompt
permalink: /questions/text
parent: Questions
---

# Text Prompt
{: .no_toc }

1. TOC
{:toc}

## Name and message

The first question in [`3cp/makes-demo2` `questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js) is a text prompt.

```js
module.exports = [
  {
    name: 'description',
    message: 'Description for this project (optional)?'
  }
  // ...
];
```

You need to at least provide a `name` and a `message` for a text prompt.

![text prompt1]({{ site.baseurl }}/assets/text-prompt1.png)

`message` is what displayed on screen. `name` is invisible to end user, after user answered the question, "makes" will have that answer in internal saved properties.

```
{
  "description": "user_answer_can_be_empty_string",
  // ...
}
```

## Default value

You can optionally provide a default value.

```js
module.exports = [
  {
    name: 'description',
    message: 'Description for this project (optional)?',
    default: 'Awesome project'
  }
  // ...
];
```

User can accept the default value by just hit `return` key.

![text prompt2]({{ site.baseurl }}/assets/text-prompt2.png)

## Validation

You can optionally provide a `validate(value)` function. The input value is the user input.

The return value should be
1. for valid value, return `undefined` or `null` or `true` (boolean) or `""` (empty string) .
2. for invalid value, return a non-empty string (error message) or `false` (boolean).

When it return `false`, the default error message is `"Please Enter A Valid Value"`.

```js
module.exports = [
  {
    name: 'description',
    message: 'Description for this project?',
    validate: value => value.length < 3 ? 'Too short!' : null
  }
  // ...
];
```

![text prompt validate]({{ site.baseurl }}/assets/text-prompt-validate.gif)

## Mask sensitive input

You can optionally set style to `"password"` for sensitive input.

```js
module.exports = [
  // ...
  {
    name: 'password',
    message: 'Password for your account?',
    style: 'password'
  }
  // ...
];
```

![text prompt password]({{ site.baseurl }}/assets/text-prompt-password.gif)

## Default question on project name

You may noticed [`3cp/makes-demo2` `questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js) did not provide a text prompt asking project name, but "makes" prompted user for `Please name this new project:` anyway.

That's a default text prompt asking for project name, it's automatically prepended to the questions list **when the skeleton didn't provide a text prompt for `name: "name"`**.

The default question for project name used by "makes":

```js
const defaultNamePrompt = {
  name: 'name',
  message: 'Please name this new project:',
  default: 'my-app',
  validate: value => value.match(/^[a-zA-Z1-9_-]*$/) ? null :
    'Please only use letters, numbers, dash(-) and underscore(_).'
};
```

Skeleton author can explicitly add a text prompt for `name: "name"` to the questions list. In this case, "makes" would not prepend the default question for project name.

Your text prompt for `name: "name"` inherits the default question for project name, you can overwrite `message`, `default`, and even use a different `validate`. The question for `name: "name"` does not have to be the first question in the list, but we recommend you to ask it first.
