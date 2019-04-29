# makes [![Build Status](https://travis-ci.org/huochunpeng/makes.svg?branch=master)](https://travis-ci.org/huochunpeng/makes)

A tool to scaffold new projects, simple enough that you would want to define your own skeletons (aka generators), skeleton for any kind of project, not just Node.js project.

# Run "makes"

"makes" is designed to be used without any installation, it only requires Node.js (at least v8).

To run "makes", do

```sh
npx makes a_skeleton_repo
```

You need to provide a skeleton repo for "makes" to work with, it supports repo shortcut for any repo on github/bitbucket/gitlab. You can do

```sh
npx makes username_or_orgname_on_github/repo_name
npx makes username_or_orgname_on_github/repo_name#branch_or_tag_or_commit
npx makes bitbucket:username_on_bitbucket/repo_name
npx makes gitlab:username_on_gitlab/repo_name#branch_or_tag_or_commit
```

"makes" support conventional repo name "new"
```sh
npx makes username_or_orgname_on_github
# is same as
npx makes username_or_orgname_on_github/new

npx makes bitbucket:username_on_bitbucket
# is same as
npx makes bitbucket:username_on_bitbucket/new
```

# A quick play of "makes"

Try `npx makes dumberjs` to see how we use "makes" to scaffold front-end SPA using dumber bundler.

# Define your skeleton (aka generators)

Different from other scaffolding tools, "makes" is designed to be very simple for skeleton author, you don't need to publish your skeleton to npm or register it to "makes". Create a repo on github/bitbucket/gitlab, that's all you need.

Because the conventional repo name "new", the easiest way is to create a repo called "new" under your github user name.

In this tutorial, we will define some skeleton repos to show all the features of "makes".

## 1. [`huochunpeng/makes-demo1`](https://github.com/huochunpeng/makes-demo1)

This skeleton demo only defined `common/READE.md` which will end up in the created project.

```sh
npx makes huochunpeng/makes-demo1
# or
npx makes huochunpeng/makes-demo1 a_project_name
```

"common" folder is the only mandatory folder you need to define, it is the base skeleton folder no matter what skeleton features end user chose. The files in this folder will be copied to the final created project.

In this demo, there is only one file in "common" folder, `common/README.md`.

    # /* @echo name */
    A new demo project!

Note, `/* @echo name */` will be pre-processed by "makes" to replace with project name.
We will talk about pre-process bit more in following demos.

The other thing you probably noticed is that makes will ask you for project name when
you run `npx makes huochunpeng/makes-demo1` (without providing project name in command line).

## 2. [`huochunpeng/makes-demo2`](https://github.com/huochunpeng/makes-demo2)

This skeleton demo shows customised questions and feature folders.

```sh
npx makes huochunpeng/makes-demo2
# or
npx makes huochunpeng/makes-demo2 a_project_name
```

### Customised questions
Questions are defined in [`questions.js`](https://github.com/huochunpeng/makes-demo2/blob/master/questions.js)
(optional), it needs to be in plain commonjs format ("makes" does not support any
kind of transpiling babel/TypeScript).

"makes" only provides two kind of prompts.

#### text prompt

Like the first one in `questions.js`, a text prompt needs a "name" field and a
"message" field.

    {
      name: 'description',
      message: 'Description for this project (optional)?'
    }

Optionally, you can also supply a "default" field like `default: 'Default description.'`
which will be used as the default answer of this prompt.

"makes" also provides one default text prompt out of the box, prepended to your
customised questions list. This auto prepend only happens when you did not provide
a question asking for `name: 'name'`.

    {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app',
    }

This means you can define your own question on project `'name'` with customised `message`
(the question end user sees) and customised `default` value. Your customised `'name'`
question does not even need to be the first question.

#### select prompt

In this demo, there are two single-select prompts, and one multi-select prompt. You can
not change the default value of single-select, it's always default to first choice. You
can mark default value for multi-select by setting `selected: true` on the choices.

Select prompt doesn't need a "name" field, answers from all single-select or multi-select
become user selected features. Unlike other prompt tool (inquirer/enquirer/prompts),
the answers in "makes" selections are unnamed. If user select 'nodejs', 'gitattributes',
and 'babel', then the answers (selected features) are simply

    ['nodejs', 'gitattributes', 'babel']

comparing to the other common used shape from inquirer/enquirer/prompts

    {type: 'nodejs', gitattributes: true, transpiler: 'babel'}

This list of selected features will then be used by "makes" to select relevant feature
folders and do conditional pre-processing.

#### How "makes" uses the answers

"makes" groups answers for all text prompts into an object like this:

    {
      name: 'my-app',
      description: 'Project description',
      author: 'Me'
    }

These named properties are **only for `@echo` pre-processing**, you can find various `@echo`
in files under `common/` and `nodejs/` folders.

"makes" groups answers for select prompts into a simple array called selected features:

    ['nodejs', 'gitattributes', 'babel']

This feature list is used by "makes" to
1. select targetd feature folders, the above feature list will select folder
`common/` and `nodejs/`.
2. use in condition expression.
 * in questions themself (see the if conditions in questions and question choices).
 * in conditional file, e.g. `common/.gitattributes__if_gitattributes`.
 * in conditional content pre-process, e.g. in `common/README.md` `// @if nodejs`.

#### Condition expression

All conditional logic in "makes" are handled by same expression engine, you can use same expression
1. in question or choice of question.

    if: 'babel || typescript'

2. in conditional file (use `and`, `or`, `not` because `&&`, `||`, `!` are not friendly in file name)

    common/some-file.xxx__if_babel_or_typescript

3. in content pre-process

```
// @if babel || typescript
This only appears when user selected babel or typescript
// @endif
```

## 3. `huochunpeng/makes-demo3`

WIP

