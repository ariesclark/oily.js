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

export interface OilyErrorJson {
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

	public toJSON(): OilyErrorJson {
		return {
			message: this.message,
			status: this.options.status ?? 500
		};
	}
}

export function toOilyError(value: Errorlike): OilyError {
	if (isOilyError(value)) return value;
	return new OilyError(value.message);
}
