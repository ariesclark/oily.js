import { Oily } from "oily";

/**
 * A dynamic route, with the parameter `~world`, 
 * accessible via `request.query.get("world")`.
 */

export default Oily.route({
	methods: {
		get: {
			async handle({ query }) {
				return Response.json({
					hello: query.get("world")
				});
			}
		}
	}
});
