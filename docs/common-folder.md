---
layout: default
title: Common Folder
nav_order: 3
description: Learn how to define common files for any feature choices
permalink: /common-folder
---

# Common Folder

Let's start with simplest example [`makesjs/demo1`](https://github.com/makesjs/demo1). Try it with:

```bash
npx makes makesjs/demo1 # or npx makes makesjs/demo1 my-app
```

![makes-demo1 screenshot]({{ site.baseurl }}/assets/makes-demo1.gif)

This demo skeleton only provided a single useful file:

```
─ common/
  └── REAME.md
```

With content:
```md
# /* @echo name */
A new demo project!
```

`common` folder is a special folder, regardless of what end user chose (we will talk about choices in [questions](questions)), all files in `common` folder will be copied to the generated project.

You would have noticed that the `common/README.md` has a special macro `/* @echo name */` which is replaced by `my-app` in the final result. We will explore more in [conditional content](conditional-content).

Next, let's look at how to define [questions](questions) to make skeleton more interesting.
