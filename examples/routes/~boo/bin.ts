import { Oily } from "../../../src";

export default Oily.route({
	middleware: [
		async (request, next) => {
			Oily.internals.log("route pre");
			const response = await next();
			Oily.internals.log("route post");

			return response;
		}
	],
	methods: {
		get: {
			middleware: [
				async (request, next) => {
					Oily.internals.log("method pre");
					const response = await next();
					Oily.internals.log("method post");

					return response;
				}
			],
			async handle(request) {
				return Response.json({ aaa: true });
			}
		}
	}
});
