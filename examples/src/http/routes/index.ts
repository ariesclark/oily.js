import { Oily } from "oily";

/**
 * A static route, without any parameters.
 */

export default Oily.route({
	methods: {
		get: {
			async handle({ cookies }) {
				cookies.set("foo", "bar");
				
				return Response.json({
					hello: "world"
				});
			}
		},
		post: {
			async handle(request) {
				const body = await request.json<{ name?: string }>();

				if (!body || !body.name)
					Oily.throw("Who's there?", { status: 400 });

				return Response.json({
					hello: body.name
				});
			}
		}
	}
});
