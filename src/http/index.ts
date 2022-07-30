import { Serve } from "bun";

import { MiddlewareFunction } from "./middleware";

export type ServeHttpOptions = Omit<Serve, "fetch" | "error"> & {
	/**
	 * An array of globs to serve statically.
	 * @see https://en.wikipedia.org/wiki/Glob_(programming)
	 */
	static?: Array<string>;
	/**
	 * An array of global middleware, applied to every request.
	 */
	middleware?: Array<MiddlewareFunction>;
};

export * from "./middleware";
export * from "./request";
export * from "./route";
export * from "./serve";
