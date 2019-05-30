---
layout: default
title: Silent Mode
nav_order: 10
description: Learn how to run "makes" in silent mode
permalink: /silent-mode
---

# Silent mode
{: .no_toc }

1. TOC
{:toc}

## The `-s` option

"makes" can run in silent mode (aka unattended mode).

1. Runs demo2 with all default answers, note you need to supply project name in command line, otherwise the project name will be default "my-app".

```bash
npx makes makesjs/demo2 app1 -s
```

![makes demo2 silent mode]({{ site.baseurl }}/assets/demo2-silent.gif)

2. Runs demo2 with non-default choices.

```bash
npx makes makesjs/demo2 app2 -s ruby
```

![makes demo2 silent mode2]({{ site.baseurl }}/assets/demo2-silent2.gif)

For the second example, you can also reorder the arguments to `npx makes makesjs/demo2 -s ruby app2` or `npx makes -s ruby makesjs/demo2 app2`.

You cannot reorder the arguments for first example where `-s` has no extra value, you can only use empty `-s` at the end of a command. Or you can do `npx makes -s= makesjs/demo2 app1` where `-s=` is same as `-s=""`, providing empty string as the value of `-s` option.

## Supply properties in silent mode

You can supply properties (for answers of text prompts) directly in command line.

```bash
npx makes makesjs/demo2 app1 --description "Awesome project" -s typescript
```

If you follow convention, always use camel case for text prompt name, for example:
```
{
  name: 'projectOwner',
  message: 'Name of the project owner?'
}
```

You can supply property as `npx makes <skeleton> --project-owner "My Name" -s`.

## Properly support silent mode

There is some complication for your `questions.js` to support silent mode properly.

Let's say you have a select default to positive option (the first choice):

```
{
  message: 'Do you want to use PostCSS',
  choices: [
    {value: 'postcss', title: 'Yes'},
    {title: 'No'}
  ]
}
```

There is nothing wrong, the silent mode will get default "postcss" in `features` array. But now you have no way for silent mode to turn off "postcss". The easiest fix is to use a valid value for negative choice:

```
{
  message: 'Do you want to use PostCSS',
  choices: [
    {value: 'postcss', title: 'Yes'},
    {value: 'no-postcss', title: 'No'}
  ]
}
```

Note you don't need to use "no-postcss" anywhere in your skeleton, but it enables silent mode to turn off "postcss": `npx makes <skeleton> my-project-name -s no-postcss`.

The simple rule is:
1. use empty value on first choice, as much as possible. This is the easiest for silent mode to work.
2. if you have to use empty value below first choice, and you want to support silent mode, use a negative term (like no-postcss) to give silent mode a chance to turn the feature off.

For multi-select, the situation is more troublesome.
1. if there is no default `selected` choice, silent mode will work easily.
2. if there are some default `selected` choices, there is no way for silent mode to turn off all of them. However, for example `a`, `b` and `c` are default selected in a big multi-select, you can use silent mode `-s a` to force choosing `a` only, but silent mode has no way to de-select all of the three default.
3. if proper silent mode support is needed for multi-select with default `selected` choices, please avoid multi-select, break the mutli-select into multiple single-select (with choice of negative term).
