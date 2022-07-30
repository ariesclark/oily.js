import { OilyRequest } from "./request";

export type MiddlewareFunctionResponse = void | Response;
export type MiddlewareNextFunction = () => Promise<MiddlewareFunctionResponse>;
export type MiddlewareFunction = (
	/**
	 * The request object.
	 * @see {@link OilyRequest}
	 */
	request: OilyRequest,
	next: MiddlewareNextFunction
) => Promise<MiddlewareFunctionResponse>;

/** This middleware exists solely to call the next middleware in the queue. */
export const NoOperationMiddleware: MiddlewareFunction = (_, next) => next();

/**
 * An identity function for {@link MiddlewareFunction}.
 */
export function middleware<T extends MiddlewareFunction>(fn: T): T {
	return fn;
}
