import { Oily } from "oily";

/**
 * A dynamic route, with the parameter `~firstName`, 
 * accessible via `request.query.get("firstName")`.
 */

export default Oily.route({
	methods: {
		get: {
			async handle({ query }) {
				return Response.json({
					hello: query.get("firstName")
				});
			}
		},
		delete: {
			async handle({ query }) {
				return Response.json({
					goodbye: query.get("firstName")
				});
			}
		}
	}
});
