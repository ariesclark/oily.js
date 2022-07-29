import { readdirSync, statSync } from "node:fs";
import * as path from "node:path";

import { OilyError } from "./error";
import {
	MiddlewareFunction,
	MiddlewareFunctionResponse,
	NoOperationMiddleware
} from "./middleware";
import { Method, OilyRequest } from "./request";
import { isRouteOptions, RouteOptions } from "./route";
import { ServeOptions } from "./serve";

export interface Router {
	tree: RouteTree;
	resolve: (request: OilyRequest) => Promise<RouteOptions | null>;
	fetch: (request: OilyRequest) => Promise<Response>;
	error: (request: OilyError) => Response;
}

export interface RouteTree {
	children: Record<string, RouteTree>;
	options: RouteOptions | null;
}

export function getRoutesDirectory(options: ServeOptions): string {
	return (options.routes ??= path.resolve(path.dirname(Bun.main), "./routes"));
}

export async function getRouteTree(options: ServeOptions, pathname?: string): Promise<RouteTree> {
	const rootDirectory = getRoutesDirectory(options);
	pathname ??= rootDirectory;

	const tree: RouteTree = { children: {}, options: null };

	for (const curPathname of readdirSync(pathname).sort()) {
		const targetPathname = path.resolve(pathname, curPathname);
		const targetStat = statSync(targetPathname);

		const url = path.relative(rootDirectory, targetPathname).split(".")[0];
		const urlSegment = url.split("/").reverse()[0];

		if (targetStat.isDirectory()) {
			tree.children[urlSegment] = await getRouteTree(options, targetPathname);
			continue;
		}

		const routeOptions = (await import(targetPathname))?.default;
		if (!isRouteOptions(routeOptions))
			OilyError.throw(`Route file "${targetPathname}" must export route options as default.`);

		tree.children[urlSegment] ??= { children: {}, options: null };
		tree.children[urlSegment].options = routeOptions;

		routeOptions.middleware ??= [NoOperationMiddleware];
		routeOptions.pathname ??= url;

		for (const [, methodOptions] of Object.entries(routeOptions.methods)) {
			methodOptions.middleware ??= [NoOperationMiddleware];
		}
	}

	return tree;
}

export async function createRouter(options: ServeOptions): Promise<Router> {
	const tree = await getRouteTree(options);
	options.middleware ??= [NoOperationMiddleware];

	const resolve: Router["resolve"] = async (request) => {
		const { pathname } = new URL(request.url);
		const urlSegments = pathname
			.slice(1)
			.split("/")
			.filter((urlSegment) => !!urlSegment);

		if (urlSegments.length === 0) {
			urlSegments.push("index");
		}

		let relTree = tree;
		for (const urlSegmentIdx in urlSegments) {
			let urlSegment = urlSegments[urlSegmentIdx];
			const lastUrlSegment = urlSegments.length === Number.parseInt(urlSegmentIdx, 10) + 1;

			if (!relTree.children[urlSegment]) {
				const dynamicSegment = Object.keys(relTree.children).find((value) => value.startsWith("~"));
				if (!dynamicSegment) return null;

				request.query.set(dynamicSegment.slice(1), urlSegment);
				urlSegment = dynamicSegment;
			}

			relTree = relTree.children[urlSegment];
			if (lastUrlSegment) {
				request.route = relTree.options || relTree.children["index"]?.options;
				return relTree.options ?? null;
			}
		}

		return null;
	};

	const fetch: Router["fetch"] = async (request) => {
		await resolve(request);

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
					middleware.push(...methodOptions.middleware, async () => {
						const response = await methodOptions.handle(request);
						return response;
					});

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

		const response = (await execute()) || null;
		if (!response) OilyError.throw("No content returned");

		return response;
	};

	const error: Router["error"] = (error) => {
		return Response.json({ error }, error.options);
	};

	return {
		tree,
		resolve,
		fetch,
		error
	};
}
