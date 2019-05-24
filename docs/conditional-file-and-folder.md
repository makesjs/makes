---
layout: default
title: Conditional File and Folder
nav_order: 6
description: Learn how to conditionally include file and folder
permalink: /conditional-file-and-folder
---

# Conditional File and Folder
{: .no_toc }

1. TOC
{:toc}

If you read all the doc above this page, you have seen them enough. You probably already understood it because they are intuitive to read.

```
─ nodejs/
  ├── .babelrc__if_babel
  ├── .gitignore
  ├── index.js__if_not_babel_and_not_typescript
  ├── package.json
  └── src/
      ├── index.js__if_babel
      └── index.ts__if_typescript
```

## Conditional file

To conditionally include a file, append

```
__if_condition-expression
(double underscore + if + single underscore + expression)
```

to any file name.

You have read the [condition expression](questions/conditional#condition-expression). There are few restrictions when using expression inside a file name

1. don't use space to separate tokens, use underscore(`_`) to separate them.
  * this is why underscore(`_`) is disallowed in choice values of select prompt.
2. don't use `&&`, `||` and `!`, only use `and`, `or` and `not`.
3. avoid using `(` and `)`.
  * we have conditional folder to help on complex condition

So you don't write `__if nodejs && !babel`, you write `__if_nodejs_and_not_babel`.

## Conditional folder

You can do exactly same thing on a folder, for example, you can re-structure the `nodejs/src/` folder:

```
─ nodejs/
  ├── src__if_babel/
  │   └── index.js
  └── src__if_typescript/
      └── index.ts
```

You can combine conditional folder together with conditional file.

```
─ nodejs/
  └── test__if_unit-test/
      └── unit__if_jest_or_jasmine/
          └── app.spec.js__if_babel
```

It will yield file `test/unit/app.spec.js` when condition `unit-test && (jest || jasmine) && babel` was met.

Skeleton [`dumberjs/new`](https://github.com/dumberjs/new) has many usage on conditional folder and file, for example the "vue" feature folder:

```
─ vue/
  ├── _index.html
  ├── package.json
  ├── src/
  │   ├── App.vue__if_sfc
  │   ├── index.ext
  │   └── vue-logo.png
  ├── src__if_not_sfc/
  │   ├── App.css__if_css
  │   ├── App.ext
  │   ├── App.less__if_less
  │   └── App.scss__if_sass
  ├── test/
  │   └── setup.ext
  ├── test__if_ava/
  │   └── App.spec.ext
  ├── test__if_jasmine/
  │   └── App.spec.ext
  ├── test__if_jest/
  │   └── App.spec.ext
  └── test__if_tape/
      └── App.spec.ext
```

One interesting fact is the `src/` and `src__if_not_sfc/` were merged together in final project, so are the `test/` and `test__if_xxx/` folders.

This feature makes "makes" skeleton easy to write and intuitive to read.
