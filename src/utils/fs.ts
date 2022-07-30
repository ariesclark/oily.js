import { readdirSync } from "fs";
import * as path from "node:path";

/**
 * @todo Change this to ``fs.promises.readdir`` when Bun supports it.
 */
async function readdirAsync(pathname: string): Promise<Array<string>> {
	return readdirSync(pathname);
}

export async function getDirectoryContents(...paths: Array<string>): Promise<Array<string>> {
	return readdirAsync(path.join(...paths)).catch(() => []);
}

export function getDirectory(...paths: Array<string>): string {
	return path.join(path.dirname(Bun.main), ...paths);
}

export function getRelativePathname(...paths: Array<string>): string {
	return path.relative(getDirectory(), path.join(...paths));
}
