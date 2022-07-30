import { statSync } from "node:fs";
import * as path from "node:path";

import { getDirectory, getDirectoryContents } from "~/utils/fs";

import { OilyRequest } from "..";
import { NoOperationMiddleware } from "../middleware";

import { assertRoute, Route } from "./route";

export interface RouteTreeInterface {
	children: Record<string, RouteTreeInterface>;
	route: Route | null;
}

export async function generate(): Promise<RouteTreeInterface> {
	const rootDirectory = getDirectory("http", "routes");

	async function recursive(directory = rootDirectory) {
		const tree: RouteTreeInterface = { children: {}, route: null };
		const files = await getDirectoryContents(directory);

		for (const fileName of files) {
			const filePath = path.resolve(directory, fileName);
			const targetStat = statSync(filePath);

			const url = path.relative(rootDirectory, filePath).split(".")[0];
			const urlSegment = url.split("/").reverse()[0];

			if (targetStat.isDirectory()) {
				tree.children[urlSegment] = await recursive(filePath);
				continue;
			}

			const route = (await import(filePath))?.default;
			assertRoute(route, filePath);

			tree.children[urlSegment] ??= { children: {}, route: null };
			tree.children[urlSegment].route = route;

			route.middleware ??= [NoOperationMiddleware];
			route.pathname ??= url;

			for (const [, methodOptions] of Object.entries(route.methods)) {
				methodOptions.middleware ??= [NoOperationMiddleware];
			}
		}

		return tree;
	}

	return recursive();
}

export async function resolve(tree: RouteTreeInterface, request: OilyRequest) {
	const { pathname } = new URL(request.url);
	const urlSegments = pathname
		.slice(1)
		.split("/")
		.filter((urlSegment) => !!urlSegment);

	if (urlSegments.length === 0) {
		urlSegments.push("index");
	}

	let relTree = tree;
	for (const urlSegmentIdx in urlSegments) {
		let urlSegment = urlSegments[urlSegmentIdx];
		const lastUrlSegment = urlSegments.length === Number.parseInt(urlSegmentIdx, 10) + 1;

		if (!relTree.children[urlSegment]) {
			const dynamicSegment = Object.keys(relTree.children).find((value) => value.startsWith("~"));
			if (!dynamicSegment) return null;

			request.query.set(dynamicSegment.slice(1), urlSegment);
			urlSegment = dynamicSegment;
		}

		relTree = relTree.children[urlSegment];
		if (lastUrlSegment) {
			request.route = relTree.route || relTree.children["index"]?.route;
			return relTree.route ?? null;
		}
	}

	return null;
}

export function stringify(tree: RouteTreeInterface): string {
	function recursive(tree: RouteTreeInterface, level: number = 0): string {
		let value = "";

		const entries = Object.entries(tree.children).sort((a, b) => {
			return a[0].replace(/index/, "") > b[0].replace(/index/, "") ? 1 : -1;
		});

		for (const [childKey, childTree] of entries) {
			const prefix = `${"  ".repeat(level - 1 < 0 ? 0 : level - 1)}${level === 0 ? "" : "⤷ "}`;
			value += `${prefix}/${childKey.replace(/index/, "")}${
				childTree.route ? `(${Object.keys(childTree.route.methods).sort().join(", ")})` : ""
			}\n`;

			if (Object.keys(childTree.children).length !== 0) {
				value += recursive(childTree, level + 1);
			}
		}

		return value;
	}

	return recursive(tree);
}
