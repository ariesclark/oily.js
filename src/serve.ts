import { ServeHttpOptions, serveHttp } from "./http";
import { ServeServiceOptions } from "./service";

export interface ServeOptions {
	http?: ServeHttpOptions;
	service?: ServeServiceOptions;
}

export async function serve(options: ServeOptions = {}) {
	await serveHttp(options.http);
}
