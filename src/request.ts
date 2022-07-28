import { RouteOptions } from "./route";

export type Method = "get" | "post";

export type OilyRequest = Request & {
	route: RouteOptions | null;
	query: URLSearchParams;
};

export function toOilyRequest(request: Request): OilyRequest {
	const { searchParams: query } = new URL(request.url);
	return Object.assign(request.clone(), { query, route: null });
}
