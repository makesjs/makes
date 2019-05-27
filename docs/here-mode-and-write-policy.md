---
layout: default
title: Here Mode and Write Policy
nav_order: 9
description: Learn how to use here mode and write policy
permalink: /here-mode-and-write-policy
---

# Here Mode
{: .no_toc }

1. TOC
{:toc}

## The `--here` switch

The normal `npx makes <skeleton_provider>` will create final project under a newly created local folder, named after project name.

However, you can use `--here` to force "makes" to create final project right in current folder, for example to create front-end project right in an existing back-end project folder.

```bash
npx makes <skeleton_provider> --here
npx makes --here <skeleton_provider>
npx makes <skeleton_provider> <optional_project_name> --here
npx makes --here <skeleton_provider> <optional_project_name>
```

## Write policy when file exists

There is an obvious complication when creating project in existing folder: what do you want to do when a new file conflicting an existing file. This is where write policy came in, to fine control the behaviour when there is some existing file.

Simple as conditional file, you can mark a file with write policy with additional suffix on its file name. Note this is only required for skeleton to make use of here mode.

Append one of three write policies to a file name:
* `__skip-if-exists` will skip the new file, the existing file is untouched.
* `__append-if-exists` will append the content of new file to existing file. Note for convenience, "makes" appends a new line before appending the content of new file.
* `__ask-if-exists` will prompt end user for keep or replace the existing file. Note for convenience, when end use selected "keep the existing file", a new file will still be created but with additional suffix `__makes` (e.g. `new-file-name__makes`).

For file without any write policy suffix, the default behaviour is overwriting existing file, which is expected but dangerous. Make sure you add write policy suffix to important files.

### The order of write policy and condition

You can mix write policy and condition in any order, it doesn't matter. Following two file names are equivalent.

```
file-name__skip-if-exists__if_nodejs_and_babel
file-name__if_nodejs_and_babel__skip-if-exists
```
