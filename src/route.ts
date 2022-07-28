import { MiddlewareFunction } from "./middleware";
import { Method, OilyRequest } from "./request";

export type MethodHandleFunction = (request: OilyRequest) => Promise<Response>;

export interface MethodOptions {
	middleware?: Array<MiddlewareFunction>;
	handle: MethodHandleFunction;
}

export interface RouteOptions {
	pathname?: string;
	schema?: {
		query?: {};
	};
	middleware?: Array<MiddlewareFunction>;
	methods: {
		[K in Method]?: MethodOptions;
	};
}

export function isRouteOptions(value: unknown): value is RouteOptions {
	return !!value && typeof value === "object" && "methods" in value;
}

export function route(options: RouteOptions) {
	return options;
}
