---
layout: default
title: Feature Folders
nav_order: 5
description: Learn how to define feature folders
permalink: /feature-folders
---

# Feature Folders

With the `features` array generated from end user's answers, we can use them to conditionally construct final project.

Let's have a look of [`makesjs/demo2`](https://github.com/makesjs/demo2) folder structure again.

```
─ questions.js
─ common/
  ├── LICENSE__if_license
  └── REAME.md
─ nodejs/
  ├── .babelrc__if_babel
  ├── .gitignore
  ├── index.js__if_not_babel_and_not_typescript
  ├── package.json
  └── src/
      ├── index.js__if_babel
      └── index.ts__if_typescript
─ ruby/
  └── main.rb
```

The `common/` folder is always in play no matter what `features` end users selected, and it's always the first folder processed.

You can define additional [feature folders](feature-folders) with name matching selected `features`, they serve as the first level of condition for grouping files/folders.

Note makes-demo2 defined feature folders `nodejs` and `ruby`, but didn't define all folders for every possible features (`babel`, `typescript`, ...).

**You don't have to define a feature folder for every feature**. There are additional way to conditionally include a file/folder, which we will elaborate in [conditional file and folder](conditional-file-and-folder).

## File objects stream

Internally, when end user selected `features` `['nodejs', 'babel']`, "makes" processes them in a file objects stream. Roughly like following gulp stream:

```js
gulp.src(['skeleton/common/**/*', 'skeleton/nodejs/**/*', 'skeleton/babel/**/*'])
  // ... additional processing for conditional file/folder, preprocessing ...
  .pipe(gulp.dest(project_folder));
```

That's how "makes" merges all common+features folders together to generate final project.

That's how [simple "makes" works](https://github.com/makesjs/makes/blob/master/lib/write-project/index.js), similar to gulp, every file is processed as a [vinyl file](https://github.com/gulpjs/vinyl). This simple work flow provided enough flexibility, we will explore more in other topics.

## Other top level folder

You can create other top level folder freely as long as the folder name is different from any `features`.

For example, you can create a `test/` folder to contain spec files for your `questions.js` and other optional JavaScript files we will introduce in other topics.

