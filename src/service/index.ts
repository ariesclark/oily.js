import * as path from "node:path";

export interface ServeServiceOptions {
	/**
	 * The absolute path to where the routes folder is located.
	 */
	directory?: string;
}

export function getServicesDirectory(options: ServeServiceOptions): string {
	return (options.directory ??= path.resolve(path.dirname(Bun.main), "./services"));
}

export * from "./service";
