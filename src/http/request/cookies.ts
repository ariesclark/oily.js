import { parse, serialize, CookieSerializeOptions } from "cookie";

export interface Cookies {
	headers: Array<[key: string, value: string]>;

	get: (key: string) => string;
	set: (key: string, value: string, options?: CookieSerializeOptions) => void;
	delete: (key: string) => void;
	assign: (values: Record<string, string | null>, options?: CookieSerializeOptions) => void;
}

export function createCookies(request: Request): Cookies {
	const rawValues = parse(request.headers.get("cookie") || "");
	const headers: Cookies["headers"] = [];

	const get: Cookies["get"] = (key) => rawValues[key] ?? null;

	const set: Cookies["set"] = (key, value, options) => {
		headers.push(["set-cookie", serialize(key, value, { path: "/", sameSite: "lax", ...options })]);
		rawValues[key] = value;
	};

	const delete_: Cookies["delete"] = (key) => {
		set(key, "", { expires: new Date(0) });
		delete rawValues[key];
	};

	const assign: Cookies["assign"] = (values, options) => {
		for (const [key, value] of Object.entries(values))
			value ? set(key, value, options) : delete_(key);
	};

	return {
		headers,

		get,
		set,
		delete: delete_,
		assign
	};
}
