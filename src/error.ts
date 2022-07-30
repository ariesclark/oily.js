import { Errorlike } from "bun";

/**
 * A type guard for {@link Errorlike}.
 */
export function isErrorlike(value: unknown): value is Errorlike {
	return (
		value instanceof Error ||
		(!!value && typeof value === "object" && "name" in value && "message" in value)
	);
}

/**
 * A type guard for {@link OilyError}.
 */
export function isOilyError(value: unknown): value is OilyError {
	return value instanceof OilyError;
}

export type OilyErrorOptions = ResponseInit;

export interface OilyErrorPlain {
	message: string;
	status: number;
}

export class OilyError extends Error {
	/**
	 * Throw an error.
	 *
	 * @example
	 * OilyError.throw("Access denied", { status: 403 })
	 */
	public static throw(message: string, options: OilyErrorOptions = {}): never {
		throw new OilyError(message, options);
	}

	public constructor(message: string, public options: OilyErrorOptions = {}) {
		super(message);

		this.options = options ?? {};
		this.options.status ??= 500;
	}

	/**
	 * @todo Check if we're in a production environment,
	 * and if we are, hide the error message when
	 * the status code is greater than 500.
	 */
	public toJSON(): OilyErrorPlain {
		return {
			message: this.message,
			status: this.options.status ?? 500
		};
	}
}

/**
 * Throw an error.
 * @see {@link OilyError}
 */
export function throwError(...parameters: Parameters<typeof OilyError["throw"]>): never {
	OilyError.throw(...parameters);
}

export function toOilyError(value: Errorlike): OilyError {
	if (isOilyError(value)) return value;
	return new OilyError(value.message);
}
