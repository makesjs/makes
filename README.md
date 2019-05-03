# makes [![Build Status](https://travis-ci.org/3cp/makes.svg?branch=master)](https://travis-ci.org/3cp/makes)

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

Note, private skeleton repo is not yet supported.

# A quick play of "makes"

Try `npx makes dumberjs` to see how we use "makes" to scaffold front-end SPA using dumber bundler.

# Define your skeleton (aka generators)

Different from other scaffolding tools, "makes" is designed to be very simple for skeleton author, you don't need to publish your skeleton to npm or register it to "makes". Create a repo on github/bitbucket/gitlab, that's all you need.

Because the conventional repo name "new", the easiest way is to create a repo called "new" under your github user name.

In this tutorial, we will define some skeleton repos to show all the features of "makes".

## 1. [`3cp/makes-demo1`](https://github.com/3cp/makes-demo1)

This skeleton demo only defined `common/READE.md` which will end up in the created project.

```sh
npx makes 3cp/makes-demo1
# or
npx makes 3cp/makes-demo1 a_project_name
```

"common" folder is the only mandatory folder you need to define, it is the base skeleton folder no matter what skeleton features end user chose. The files in this folder will be copied to the final created project.

In this demo, there is only one file in "common" folder, `common/README.md`.

    # /* @echo name */
    A new demo project!

Note, `/* @echo name */` will be pre-processed by "makes" to replace with project name.
We will talk about pre-process bit more in following demos.

The other thing you probably noticed is that makes will ask you for project name when
you run `npx makes 3cp/makes-demo1` (without providing project name in command line).

## 2. [`3cp/makes-demo2`](https://github.com/3cp/makes-demo2)

This skeleton demo shows customised questions and feature folders.

```sh
npx makes 3cp/makes-demo2
# or
npx makes 3cp/makes-demo2 a_project_name
```

### Customised questions
Questions are defined in [`questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js)
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

## 3. [`3cp/makes-demo2#adv`](https://github.com/3cp/makes-demo2/tree/adv)

Same functionality as basic makes-demo2, but this one shows following advanced
features.

```sh
npx makes 3cp/makes-demo2#adv
# or
npx makes 3cp/makes-demo2#adv a_project_name
```

## Condition on folders

"makes" only treats top level feature folders name as static, any folders or files
beneath feature folders can be conditional.

For example, this demo simplified
```
nodejs/src/index.js__if_babel
nodejs/src/index.ts__if_typescript
```

To just
```
nodejs/src__if_babel_or_typescript/index.ext
```

Note we merged babel and TypeScript version of the source code into one file. The
contents of the two files were same. You can further conditionally pre-process the
content in `index.ext` if you need variation between babel/TypeScript implementations.

For example:

```
export default function() {
  // @if babel
  message = 'Hello';
  // @endif
  // @if typescript
  public message: String = 'Hello';
  // @endif
};
```

You can also use condition on multiple level of folders and file itself. All the
conditions must be satisfied for that file to be included in final write out.

For example:
```
feature-folder/test__if_jest_or_jasmine/unit__if_typescript/foo.ts__if_foo
feature-folder/test__if_jest_or_jasmine/unit__if_babel/foo.js__if_foo
```

How "makes" yields `index.ext` to `index.js` for babel, and `index.ts` for TypeScript?
Well, "makes" doesn't support conditional mutation of file name out of the box, you need
to tap into "makes" files stream processing to enable this function.

## `transforms.js` (optional)

The optional `transforms.js` can provide one or many transform streams to handle the
files streaming.

Internally, "makes" processes all skeleton files with Vinyl file object
stream, almost same as a gulp stream.

`transforms.js` can provide
1. `prepend` transform (or array of transforms) to process the raw Vinyl file objects
before "makes" sees them,
2. `append` transform (or array of transforms) to a final process on Vinyl files after
"makes" processed them, but just before "makes" writes them out to disk.

In this demo we only provided a single `append` transform in `transforms.js`.

```js
const {Transform} = require('stream');

exports.append = function(properties, features) {
  return new Transform({
    objectMode: true,
    transform: function(file, env, cb) {
      if (file.isBuffer() && file.extname === '.ext') {
        // change .ext to .ts or .js file
        file.extname = features.includes('typescript') ? '.ts' : '.js'
      }
      cb(null, file);
    }
  });
};
```

First, every unit in `append` or `prepend` is a function:
1. got input parameters of
 * `properties` the properties got from text prompts answers.
 * `features` the selected features got from select prompts answers.
 * `targetDir` the root target directory where all files will be written to, you can
   check target directory for some existing files.
 * `unattended` this will be true if user runs "makes" in silent mode (`-s`). You have
   to ensure not prompting user for any action in silent mode.
2. return a transform stream.

Here we use core Node.js stream API to create a new transform stream. For experienced
gulp user, you might be more familiar with `through2` wrapper. The above code is exactly
same as following `through2` code.

```js
const through2 = require('through2');

exports.append = function(properties, features) {
  return through2.obj(function(file, env, cb) {
    if (file.isBuffer() && file.extname === '.ext') {
      // change .ext to .ts or .js file
      file.extname = features.includes('typescript') ? '.ts' : '.js'
    }
    cb(null, file);
  });
};
```

We recommend just use core Node.js stream API. If you use `through2`, it means your skeleton
repo has runtime dependency on `through2`, you will need to provide a package.json file to
notify "makes" about the runtime dependency. That extra dependency installation will slow down
"makes", so use runtime dependency rarely.

`package.json`

```json
{
  "dependencies": {
    "through2": "^3.0.1"
  }
}
```

For a reference on using `through2` at runtime, check [`3cp/makes-demo2#adv-through2`]
(https://github.com/3cp/makes-demo2/tree/adv-through2).

Note you can provide multiple transforms:

```js
const {Transform} = require('stream');

exports.append = [
  function(properties, features) {
    return new Transform({...});
  },
  function(properties, features) {
    return new Transform({...});
  },
  // ...
];
```

