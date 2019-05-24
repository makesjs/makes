---
layout: default
title: Questions
nav_order: 4
description: Learn how to define questions
permalink: /questions
has_children: true
---

# Questions

We will use [`3cp/makes-demo2`](https://github.com/3cp/makes-demo2). Try it with:

```bash
npx makes 3cp/makes-demo2 # or npx makes 3cp/makes-demo2 my-app
```

![makes-demo2 screenshot]({{ site.baseurl }}/assets/makes-demo2.gif)

This demo skeleton defined an optional file [`questions.js`](https://github.com/3cp/makes-demo2/blob/master/questions.js), plus some [feature folders](feature-folders) `nodejs` and `ruby` (we will talk about them in next page).

```
─ questions.js
─ common/
  ├── LICENSE__if_license
  └── REAME.md
─ nodejs/
  ├── .babelrc__if_babel
  ├── .gitignore
  ├── index.js__if_not_babel_and_not_typescript
  ├── package.json
  └── src/
      ├── index.js__if_babel
      └── index.ts__if_typescript
─ ruby/
  └── main.rb
```

The optional `questions.js` file needs to provide an array of questions. For simplicity, "makes" doesn't support ESM module format, nor Babel/TypeScript transpiling. It must be written in pain CommonJS format which Node.js can understand.

```js
module.exports = [
  // ...
];
```

"makes" supports only three types of questions: text prompt, select prompt, multi-select prompt. These prompts are based on [prompts](https://github.com/terkelg/prompts), but customised and simplified.
