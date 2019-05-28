---
layout: default
title: '@eval'
nav_order: 3
description: 'Learn how to use @eval'
permalink: /preprocess-file-content/eval
parent: Preprocess File Content
---

# @eval

`@eval` is brought in because `@echo` is not enough. For example in a json file:

```json
{
  "description": "/* @echo description */"
}
```

What if `description` contains some character like `"` which needs to escaped? `@echo` is not flexible to deal with such situation.

You can eval a JavaScript expression involving one or more properties from the [`properties`](questions/features-and-properties#properties) hash object.

For properties
```js
var properties = {
  name: 'my-app',
  description: '"makes" is great!',
  title: '<makes>'
  author: 'CP'
};
```

## Use @eval to escape a string in JavaScript/JSON

We can borrow `JSON.stringify()` for this task, note the result already wrapped with double-quotes.

```json
{
  "name": "/* @echo name */",
  "description": /* @eval JSON.stringify(description) */
}
```

Yield result:

```json
{
  "name": "my-app",
  "description": "\"makes\" is great!"
}
```

## @echo project name

We used `@echo name` to display our project name in many examples. Echo project name is safe, as long as you didn't modify the default validation for project name (default validation only allows letters, numbers, dash(`-`) and underscore(`_`) in project name).

## Use @eval to escape a string in HTML

JavaScript didn't provide any built-in function to escape string in HTML. We have to use this verbose expression.

```js
aStr.replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char])
```

```html
<div>
  <p><!-- @eval (title || '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]) --></p>
</div>
```

Yield result:

```html
<div>
  <p>&lt;makes&gt;</p>
</div>
```

## Other usage

You can use `@eval` to cover more situations beyond escaping. It's flexible but dangerous, use it rarely.

For example, you can print out current year in license file like this:

```
Copyright (c) /* @eval new Date().getFullYear() */ /* @echo author */
```

