import { Serve } from "bun";

import { createRouter } from "./router";
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
export async function serve(options: ServeOptions = {}) {
	const { fetch, error } = await createRouter(options);

	return Bun.serve({
		...options,
		fetch,
		error
	});
}
