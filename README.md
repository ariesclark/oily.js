<div align="center">
  <h1>Oily <img width="32" src="https://bun.sh/logo.svg"/></h1>
  <p>An <i>unpleasantly</i> smooth experience!</p>
  <p>
    <a href="https://npm.im/oily">
      <img alt="npm" src="https://img.shields.io/npm/v/oily">
      <img alt="npm" src="https://img.shields.io/npm/dm/oily">
    </a>
    <a href="https://github.com/ariesclark/oily.js">
      <img alt="GitHub issues" src="https://img.shields.io/github/issues/ariesclark/oily.js">
      <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/ariesclark/oily.js">
    </a>
  </p> 
  <span>
		<a href="#installation">Installation</a>
		<span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
		<a href="#usage">Usage</a>
		<span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
		<a href="https://discord.gg/rj3YQQu">Discord</a>
	</span>
 
</div>

<hr>


## Installation
Assuming you've got [Bun.js](https://bun.sh/) installed, The installation is super simple, just run the following command.
```bash
bun add oily
```

## Usage
```ts
// file: ./index.ts
import { Oily } from "oily";

await Oily.serve({
  middleware: [
    async (request, next) => {
      // do something before.
      const response = await next();
      // do something after.

      return response;
    }
  ]
});

// now listening on port 3000.
```

Routes are found, by default, within the ``./routes`` directory, next to the entrypoint.
```ts
// file: ./routes/foo.ts
import { Oily } from "oily";

export default Oily.route({
  methods: {
    get: {
      async handle() {
        return Response.json({
          foo: true
        });
      }
    }
  }
});
```
```bash
curl http://localhost:3000/foo
# { "foo": true }
```

```ts
// file: ./routes/~bar/baz.ts
// this is a dynamic route.
import { Oily } from "oily";

export default Oily.route({
  methods: {
    get: {
      async handle({ query }) {
        return Response.json({
          baz: query.get("bar")
        });
      }
    }
  }
});
```
```bash
curl http://localhost:3000/hello/baz
# { "baz": "hello" }
```