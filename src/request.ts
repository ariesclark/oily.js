import { RouteOptions } from "./route";

/**
 * @see [MDN - Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
 */
export type Method = "get" | "head" | "post" | "put" | "delete" | "options" | "patch";

/**
 * The request object, used to obtain
 * information about the current request.
 *
 * @inherits {@link Request}
 */
export type OilyRequest = Request & {
	/**
	 * The current route descriptor, if available.
	 */
	route: RouteOptions | null;
	/**
	 * The request query.
	 */
	query: URLSearchParams;
};

export function toOilyRequest(request: Request): OilyRequest {
	const { searchParams: query } = new URL(request.url);

	/**
	 * @todo gonna pretend I know why this needs to be here,
	 * the request body doesn't work in the function
	 * handler if this line isn't here.
	 *
	 * some bun.js event loop/promises bug maybe??
	 * @see https://discord.com/channels/876711213126520882/887787428973281300/1002708555180286123
	 * > yes this is a bug in bun - jarred
	 */
	void request.arrayBuffer();

	return Object.assign(request, { query, route: null });
}
