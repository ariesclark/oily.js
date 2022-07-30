<div align="center">
  <h1>Oily <img width="32" src="https://bun.sh/logo.svg"/></h1>
  <p>A <i>blazingly</i> fast <a href="https://bun.sh">Bun.js</a> filesystem router, with</br> an unpleasantly smooth experience!</p>
  <p>
    <a href="https://npm.im/oily">
      <img alt="npm" src="https://img.shields.io/npm/v/oily">
      <img alt="npm" src="https://img.shields.io/npm/dm/oily">
    </a></br>
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
		<a href="/examples">Examples</a>
		<span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
		<a href="https://discord.gg/rj3YQQu">Discord</a>
	</span>
 
</div>

<hr>


## Installation


Once you've got [Bun.js](https://bun.sh/) installed, The installation is super simple, just run the following commands.
```bash
# Install Bun.js, If you haven't yet.
curl https://bun.sh/install | bash

# Use Bun's package manager to install, or you
# can use any package manager that supports Bun.js.
bun add oily
```

## Usage
```ts
// file: ./src/index.ts
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

Routes are found, by default, within the ``./http/routes`` directory, next to the entrypoint.
```ts
// file: ./src/http/routes/foo.ts
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
