---
layout: default
title: '@echo'
nav_order: 1
description: 'Learn how to use @echo'
permalink: /preprocess-file-content/echo
parent: Preprocess File Content
---

# `@echo`

You can echo any property from the [`properties`](questions/features-and-properties#properties).

For properties
```js
var properties = {
  name: 'my-app',
  description: '',
  author: 'CP'
};
```

## JavaScript syntax

```md
# // @echo name
Lorem ipsum dolor.
```

Or

```md
# /* @echo name */
Lorem ipsum dolor.
```

Yield result:

```md
# my-app
Lorem ipsum dolor.
```

## HTML syntax

```html
<div>
  <!-- @echo author -->
</div>
```

Yield result:

```html
<div>
  CP
</div>
```

## Missing property

`@echo missing_property` yields empty string.
