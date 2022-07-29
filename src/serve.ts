import { Serve } from "bun";

import { log } from "./log";
import { toOilyError } from "./error";
import { createRouter } from "./router";
import { toOilyRequest } from "./request";
import { MiddlewareFunction } from "./middleware";

export type ServeOptions = Omit<Serve, "fetch" | "error"> & {
	/**
	 * The absolute path to where the routes folder is located.
	 */
	routes?: string;
	/**
	 * An array of global middleware, applied to every request.
	 */
	middleware?: Array<MiddlewareFunction>;
};

/**
 * Start a *blazingly* fast Bun.js filesystem router.
 * @param options {@link ServeOptions}
 */
export async function serve(options: ServeOptions) {
	const router = await createRouter(options);

	const server = Bun.serve({
		...options,
		fetch: (request) => router.fetch(toOilyRequest(request)),
		error: (value) => router.error(toOilyError(value))
	});

	log(`listening on ${server.hostname}`);
	return server;
}
