import { createRouter } from "./router";

import { ServeHttpOptions } from ".";

/**
 * Start a *blazingly* fast Bun.js filesystem router.
 */
export async function serveHttp(options: ServeHttpOptions = {}) {
	return Bun.serve({
		...options,
		...(await createRouter(options))
	});
}
