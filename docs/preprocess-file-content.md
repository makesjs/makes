---
layout: default
title: Preprocess File Content
nav_order: 7
description: Learn how to conditionally preprocess file content
permalink: /preprocess-file-content
has_children: true
---

# Preprocess File Content

"makes" preprocess all text file content, binary files are skipped. The implementation is borrowed from [preprocess](https://github.com/jsoverson/preprocess), reduced and customised.

The preprocess in "makes" only supports three directives:

1. `@echo`
2. `@if`
3. `@eval` (not in original [preprocess](https://github.com/jsoverson/preprocess))

We retained the two types syntax from original preprocess:
1. HTML syntax, for any file with extension `.html`, `.htm`, `.xml`, or `.svg`.
2. JavaScript syntax, for any other text file.

There are plenty of examples in [`dumberjs/new`](https://github.com/dumberjs/new) and [`makesjs/demo2`](https://github.com/makesjs/demo2).
