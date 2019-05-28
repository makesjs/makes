---
layout: default
title: '@if'
nav_order: 2
description: 'Learn how to use @if'
permalink: /preprocess-file-content/if
parent: Preprocess File Content
---

# `@if`

You can use `@if` with [condition expression](questions/conditional#condition-expression) using the [`features`](questions/features-and-properties#features) array.

You have to pair every `@if` with one `@endif`. `@if` can be nested (there are plenty examples of nested if in our examples skeleton repos).

For features
```js
var features = [ 'something', 'very-good' ];
```

## JavaScript syntax

A json file like:

```json
{
  // @if !something
  "other-thing": true,
  // @endif
  // @if something && very-good
  "good-stuff": true,
  // @endif
}
```

Or

```json
{
  /* @if !something */
  "other-thing": true,
  /* @endif */
  /* @if something && very-good */
  "good-stuff": true,
  /* @endif */
}
```

Yield result:

```json
{
  "good-stuff": true,
}
```

You may noticed the result is not a valid JSON, there is one extra comma. "makes" actually will clean up any JSON file for writing to final project, this is specially designed to cater condition inside JSON file.

## HTML syntax

```html
<div>
  <!-- @if !something -->
  <other-thing></other-thing>
  <!-- @endif -->
  <!-- @if something && very-good -->
  <good-stuff></good-stuff>
  <!-- @endif -->
</div>
```

Yield result:

```html
<div>
  <good-stuff></good-stuff>
</div>
```
