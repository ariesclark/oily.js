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
	return Object.assign(request.clone(), { query, route: null });
}
