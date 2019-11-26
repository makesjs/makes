# makes [![Build Status](https://travis-ci.org/makesjs/makes.svg?branch=master)](https://travis-ci.org/makesjs/makes)

A tool to scaffold new projects, simple enough that you would want to define your own skeletons (aka generators).

**Document site: https://makes.js.org**

## Run "makes"

"makes" is designed to be used without any installation, as long as you have [Node.js](https://nodejs.org). To run "makes", do:

```bash
npx makes <skeleton_provider>
```

## Example skeletons

- [`aurelia/new`](https://github.com/aurelia/new) `npx makes aurelia`
- [`dumberjs/new`](https://github.com/dumberjs/new) `npx makes dumberjs`
- [`makesjs/demo1`](https://github.com/makesjs/demo1) `npx makes makesjs/demo1`
- [`makesjs/demo2`](https://github.com/makesjs/demo2) `npx makes makesjs/demo2`

Try `dumberjs` skeleton to create various types of front-end projects. [`dumberjs`](https://github.com/dumberjs/dumber) is a JavaScript bundler using AMD module format for front-end SPA apps.

```bash
npx makes dumberjs
# or
npx makes dumberjs my-project
```

Note `npx makes dumberjs` is a conventional short-cut of `npx makes dumberjs/new`.

<p align="center">
<img src="https://makesjs.github.io/assets/makes-dumberjs.gif" alt="makes dumberjs" width="720">
</p>
