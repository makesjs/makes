---
layout: default
title: Transforms
nav_order: 9
description: Learn how to tape into file objects stream transforms
permalink: /transforms
---

# Transforms
{: .no_toc }

1. TOC
{:toc}

"makes" provided conditional file and write policy, it can cover majority of use cases. But it's not flexible enough to cover all use cases.

For example in [`3cp/makes-demo2`](https://github.com/3cp/makes-demo2), there is one `index.js` for `babel`, and another `index.ts` for `typescript`.

```
─ nodejs/
  └── src/
      ├── index.js__if_babel
      └── index.ts__if_typescript
```

If you check the content of the two files, they are identical. It's kind of waste to have two files. What about to define just one file:

```
─ nodejs/
  └── src/
      └── index.ext
```

Then somehow changes file name from `index.ext` to `index.js` or `index.ts` based on `features` array? Well, "makes" didn't provide any direct way of doing this, but you can tape into "makes" file objects stream to easily support this feature with just few lines of code.

## "makes" file objects stream

We briefly showed you file objects stream in [feature folders](feature-folders#file-objects-stream). Here is the more complete version of the steam. Roughly like following gulp stream:

```js
gulp.src(['skeleton/common/**/*', 'skeleton/nodejs/**/*', 'skeleton/babel/**/*'])

  // customise point
  .pipe(customise_prepend_transforms)

  .pipe(mark_write_policy)
  .pipe(filter_conditional_file_and_folder)
  .pipe(preprocess_file_content)
  .pipe(merge_readme_and_json) // To be explained

  // customise point
  .pipe(customise_append_transforms)

  .pipe(check_project_folder_and_honour_write_policy)
  .pipe(gulp.dest(project_folder));
```

There are two customise points for skeleton designer to tape into the stream, "prepend" and "append" transforms.

## Default behaviour on duplicated skeleton files

Before show you the custom transforms, we need to explain more on step `merge_readme_and_json`.

When you define duplicated skeleton files. For example:

```
common/a-file
nodejs/a-file
```

"makes" default behaviour is to honour the last one `nodejs/a-file`, so the order of `features` array is actually significant. You can deliberately offer a new file in some feature folder which overshadow previous feature folders (according to the order of `features` array, which is the order of skeleton questions and choices).

However, for convenience, "makes" offering special behaviour on two types of files.

### Concatenate readme files

If the duplicated skeleton files is a readme file (`/readme(\.(md|txt|markdown))?$/i`), "makes" will concatenate them together. Note for convenience, "makes" appends a new line before appending the content of additional readme.

If you have `common/README.md` with content `a`, `nodejs/README.md` with content `b`, the final `README.md` could be `a\nb` if end user selected `nodejs`.

### Merge JSON files

For simpler skeleton of JavaScript projects, "makes" merges JSON files (which includes `package.json`) from duplicated files into one.

```
common/package.json
nodejs/package.json
nodejs/package.json__if_babel
```

"makes" will merge the three `package.json` into one if end user selected `nodejs` and `babel`.

"makes" not only merges JSON files, but also cleans it up. So you can write:

```json
{
  // @if a
  "a": true,
  // @endif
  // @if b
  "b": true
  // @endif
}
```

Without worrying about the trailing `,` in `{"a": true,}`.

## Append transforms

## Runtime dependencies

## Prepend transforms
