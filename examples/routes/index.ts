import { Oily } from "../../src";

export default Oily.route({
	schema: {
		query: {}
	},
	methods: {
		get: {
			async handle() {
				return Response.json({ a: true });
			}
		}
	}
});
