import { Route } from "../route";

import { Cookies, createCookies } from "./cookies";

/**
 * @see [MDN - Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
 */
export type Method = "get" | "head" | "post" | "put" | "delete" | "options" | "patch";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RequestState {}

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
	route: Route | null;
	state: RequestState;
	/**
	 * The request query.
	 */
	query: URLSearchParams;
	cookies: Cookies;
};

export function toOilyRequest(request: Request): OilyRequest {
	const { searchParams: query } = new URL(request.url);

	/**
	 * @todo gonna pretend I know why this needs to be here,
	 * the request body doesn't work in the function
	 * handler if this line isn't here.
	 *
	 * some bun.js event loop/promises bug maybe??
	 *
	 * @see https://discord.com/channels/876711213126520882/887787428973281300/1002708555180286123
	 * > yes this is a bug in bun - jarred
	 */
	void request.arrayBuffer();

	const cookies = createCookies(request);

	return Object.assign(request, {
		query,
		cookies,
		state: {},
		route: null
	});
}
