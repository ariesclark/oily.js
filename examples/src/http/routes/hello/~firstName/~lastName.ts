import { Oily } from "oily";

/**
 * A nested dynamic route, with the parameter `~firstName` and `~lastName`, 
 * accessible via `request.query.get("firstName")` and `request.query.get("lastName")`.
 */

export default Oily.route({
	methods: {
		get: {
			async handle({ query }) {
				return Response.json({
					hello: `${query.get("firstName")} ${query.get("lastName")}`
				});
			}
		}
	}
});
