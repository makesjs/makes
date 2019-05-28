---
layout: default
title: Tips
nav_order: 4
description: Understand more on how preprocess works
permalink: /preprocess-file-content/tips
parent: Preprocess File Content
---

# Tips
{: .no_toc }

1. TOC
{:toc}

## Blind preprocess

"makes" preprocess doesn't do full syntax analysis on any structured files (js/html/...), it only blindly matches preprocess directive (`@echo`/`@if`/`@eval`). That's why following example works:

```js
var name = "/* @echo name */";
```

Preprocess successfully picked up `/* @echo name */` even though it's inside a JavaScript string literal.

"makes" preprocess knows nothing more than its more syntax.

## Edge cases

In rarely cases, you may want "makes" preprocess to ignore some directive literal. For example you want to write a file to the final project for `gulp-preprocess` (the gulp wrapper of [preprocess](https://github.com/jsoverson/preprocess)) to use.

Here we use a trick to use `/* @echo na */` to break any `@echo`/`@if`/`@endif`/`@eval` directive. Because `na` is not defined in `properties`, `/* @echo na */` will yield to empty string.

For example in https://github.com/dumberjs/new/blob/master/aurelia/src/main.ext

```js
// @/* @echo na */if isProduction
aurelia.use.developmentLogging('warn');
// @/* @echo na */endif
```

Yield result:
```js
// @if isProduction
aurelia.use.developmentLogging('warn');
// @endif
```

The `@if` and `@endif` directives were reserved.

## Cosmetic one line condition

Sometime your one line condition will trigger annoying syntax error in your editor. Like this one:

```js
var target = /* @if no-ie */"es6"/* @endif *//* @if ie */"es3"/* @endif */;
```

While this is still a correct skeleton file, the cosmetic syntax error in editor is annoying. To help you avoid this small setback, you can use `**` instead of `*/` to close an if clause. This is a feature inherited from original [preprocess](https://github.com/jsoverson/preprocess).

```js
var target = /* @if no-ie **"es6"/* @endif *//* @if ie */"es3"/* @endif */;
```

