import { Serve } from "bun";

import { OilyError, toOilyError } from "~/error";

import { Method, toOilyRequest } from "./request";
import { RouteTree } from "./route";
import {
	MiddlewareFunction,
	MiddlewareFunctionResponse,
	NoOperationMiddleware
} from "./middleware";

import { ServeHttpOptions } from ".";

export type Router = Pick<Serve, "fetch" | "error">;

export async function createRouter(options: ServeHttpOptions): Promise<Router> {
	const tree = await RouteTree.generate();
	console.debug(RouteTree.stringify(tree));

	const error: Router["error"] = function (value) {
		const error = toOilyError(value);
		return Response.json({ error }, error.options);
	};

	const fetch: Router["fetch"] = async function (value) {
		const request = toOilyRequest(value);
		await RouteTree.resolve(tree, request);

		options.middleware ??= [NoOperationMiddleware];
		const middleware: Array<MiddlewareFunction> = [
			...options.middleware,
			async (request, next) => {
				if (!request.route) OilyError.throw("Not found", { status: 404 });

				request.route.middleware ??= [NoOperationMiddleware];
				middleware.push(...request.route.middleware, async (request, next) => {
					if (!request.route) return;

					const method = request.method.toLowerCase() as Method;
					const methodOptions = request.route.methods[method];

					if (!methodOptions) {
						const allow = Object.keys(request.route.methods).join(", ").toUpperCase();
						OilyError.throw("Method not allowed", {
							status: 405,
							headers: { allow }
						});
					}

					methodOptions.middleware ??= [NoOperationMiddleware];
					middleware.push(...methodOptions.middleware, methodOptions.handle);

					return next();
				});

				return next();
			}
		];

		async function execute(): Promise<MiddlewareFunctionResponse> {
			let previousIdx = -1;

			async function runner(idx: number): Promise<MiddlewareFunctionResponse> {
				if (idx === previousIdx) OilyError.throw("Cannot call next() multiple times.");

				previousIdx = idx;
				if (middleware[idx]) {
					const response = await middleware[idx](request, () => {
						return runner(idx + 1);
					});

					if (response) return response;
				}
			}

			return runner(0);
		}

		const response = (await execute().catch((reason) => error.call(this, reason))) || null;
		if (!response) OilyError.throw("No content");

		return response;
	};

	return {
		fetch,
		error
	};
}
