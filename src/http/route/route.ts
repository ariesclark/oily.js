import { OilyError } from "../../error";
import { getRelativePathname } from "../../utils/fs";
import { MiddlewareFunction } from "../middleware";
import { Method, OilyRequest } from "../request";

/**
 * Route method handle function, used to
 * execute code for this particular request.
 */
export type MethodHandleFunction = (
	/**
	 * The request object.
	 * @see {@link OilyRequest}
	 */
	request: OilyRequest
) => Promise<Response>;

export interface MethodOptions {
	/**
	 * An array of method middleware, applied
	 * solely to this request method.
	 */
	middleware?: Array<MiddlewareFunction>;
	/**
	 * The handle function, used to execute
	 * code for this request.
	 */
	handle: MethodHandleFunction;
}

export interface Route {
	/**
	 * The route pathname, automatically assigned
	 * when the route tree is generated.
	 */
	pathname?: string;
	schema?: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		query?: {};
	};
	/**
	 * An array of route middleware, applied to the
	 * entire route, regardless of request method.
	 */
	middleware?: Array<MiddlewareFunction>;
	/**
	 * An object where the keys are the request
	 * method, and the values are the route handlers.
	 *
	 * @example
	 * const methods = {
	 * 	get: {...},
	 * 	post: {...}
	 * }
	 */
	methods: {
		[K in Method]?: MethodOptions;
	};
}

/**
 * A type guard for {@link Route}, used to ensure
 * a route description conforms to the proper structure.
 */
export function isRoute(value: unknown): value is Route {
	return !!value && typeof value === "object" && "methods" in value;
}

/**
 * An assertion function for {@link Route}.
 */
export function assertRoute(value: unknown, pathname?: string): asserts value is Route {
	if (!isRoute(value))
		OilyError.throw(
			`Route file "${
				pathname ? getRelativePathname(pathname) : "unknown"
			}" must export route object as default.`
		);
}

/**
 * An identity function for {@link Route}.
 */
export function route<T extends Route>(value: T): T {
	return value;
}
