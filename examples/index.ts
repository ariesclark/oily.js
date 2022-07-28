import { Oily } from "../src";

await Oily.serve({
	middleware: [
		async (request, next) => {
			Oily.internals.log("global pre");
			const response = await next();
			Oily.internals.log("global post");
		

			return response;
		}
	]
});
