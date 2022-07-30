import { Oily } from "oily";

export default Oily.route({
	methods: {
		get: {
			async handle() {
				return Response.json({
					hello: "alice",
					loved: true
				});
			}
		}
	}
});
