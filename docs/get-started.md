---
layout: default
title: Get Started
nav_order: 2
description: Learn how to run "makes" command
permalink: /get-started
---

# Get Started

Make sure you have [`Node.js`](https://nodejs.org) installed. Let's try `dumberjs` skeleton to scaffold a front-end SPA project.

```bash
npx makes dumberjs
```

![makes dumberjs]({{ site.baseurl }}/assets/makes-dumberjs.gif)

You will be prompted to provide a project name and few selections to generate a front-end project using `Aurelia`, `React`, or `Vue` framework.

That's the basic command to use "makes", no installation required, no skeleton (generator) installation required.

You can also provide project name to the command line. If you didn't provide the project name, "makes" will prompt you for it.

```bash
npx makes dumberjs my-app
```

## Use hosted skeleton repo

The above `dumberjs` skeleton is provided by a GitHub repository [`dumberjs/new`](https://github.com/dumberjs/new).

"makes" supports Git repo short-cuts for GitHub/Bitbucket/GitLab hosted public repos. For example:

```bash
npx makes username/repo
npx makes github:username/repo
npx makes bitbucket:username/repo
npx makes gitlab:username/repo
```

You can also target branche/tag/commit, this is very common for skeleton developer:

```bash
npx makes username/repo#branch
npx makes bitbucket:username/repo#tag
npx makes gitlab:username/repo#commit-hash
```

"makes" also supports a conventional repo name called "new", the previous example `npx makes dumberjs` is treated as `npx makes dumberjs/new`. This convention is great for any organisation or individual to provide a "makes" skeleton.

```bash
npx makes username # same as: npx makes username/new
npx makes github:username # same as: npx makes github:username/new
npx makes bitbucket:username # same as: npx makes bitbucket:username/new
npx makes gitlab:username # same as: npx makes gitlab:username/new
```

Note: private skeleton repo is supported, as long as you have proper SSH public key setup.
- [GitHub](https://help.github.com/en/articles/connecting-to-github-with-ssh)
- [Bitbucket](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html)
- [GitLab](https://docs.gitlab.com/ee/ssh/)

## Use local skeleton folder

For developer, or just for personal usage, you can use a local folder as the skeleton provider. You have to use a relative path (start with `./` or `../`) for "makes" to recognise you want a local folder.

```bash
npx makes ./local/folder
npx makes ../../local/folder
```

## Define a skeleton

"makes" is designed to be super easy for skeleton authors. You can start with a local folder or a repo on GitHub.

1. [Common Folder](common-folder)
2. [Questions](questions)
3. [Feature Folders](feature-folders)
4. [Conditional File and Folder](conditional-file-and-folder)
5. [Preprocess File Content](preprocess-file-content)
6. [Here Mode and Write Policy](here-mode-and-write-policy)
7. [Transforms](transforms)
8. [Silent Mode](silent-mode)
9. ["before" and "after" tasks](before-and-after-tasks)

