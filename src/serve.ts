import { Serve } from "bun";

import { log } from "./log";
import { OilyError } from "./error";
import { createRouter } from "./router";
import { toOilyRequest } from "./request";
import { MiddlewareFunction } from "./middleware";

export type ServeOptions = Omit<Serve, "fetch" | "error"> & {
	routes?: string;
	middleware?: Array<MiddlewareFunction>;
};

export async function serve(options: ServeOptions) {
	const router = await createRouter(options);

	const server = Bun.serve({
		...options,
		fetch: (request) => router.handle(toOilyRequest(request)),
		error: (value) => {
			const error = OilyError.from(value);
			return Response.json({ error }, error.options);
		}
	});

	log(`listening on ${server.hostname}`);
	return server;
}
