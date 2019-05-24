# makes [![Build Status](https://travis-ci.org/3cp/makes.svg?branch=master)](https://travis-ci.org/3cp/makes)

A tool to scaffold new projects, simple enough that you would want to define your own skeletons (aka generators).

**Documentation: https://3cp.github.io/makes**

## Run "makes"

"makes" is designed to be used without any installation, as long as you have [Node.js](https://nodejs.org). To run "makes", do:

```bash
npx makes a_skeleton_repo
```

## Example skeleton: [`dumberjs/new`](https://github.com/dumberjs/new)
Try `dumberjs` skeleton to create various types of front-end projects. [`dumberjs`](https://github.com/dumberjs/dumber) is a JavaScript bundler using AMD module format for front-end SPA apps.

```bash
npx makes dumberjs
```

Note `npx makes dumberjs` is a conventional short-cut of `npx makes dumberjs/new`.

<p align="center">
<img src="https://3cp.github.io/makes/assets/makes-dumberjs.gif" alt="makes dumberjs" width="480">
</p>