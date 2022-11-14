import * as dotenv from "dotenv";

dotenv.config();

import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import statusApi from "./api/status";
import announcementsApi from "./api/announcements";
import formApi from "./api/form";
import validateConfig from "./utils/validateConfig";
import { indexTemplate, cssLiteral } from "./utils/defineTemplates";

const fastify = Fastify({
	logger: true
});

fastify.register(formBodyPlugin);

fastify.register(fastifySensible);

fastify.register(cors, {
	origin: "*"
});

fastify.get("/", (request, reply) => {
	reply.type("text/html").send(indexTemplate);
});

fastify.get("/global.css", (request, reply) => {
	reply.type("text/css").send(cssLiteral);
});

announcementsApi(fastify);
formApi(fastify);
statusApi(fastify);

fastify.listen(
	{ port: Number(process.env.PORT), host: "0.0.0.0" },
	(err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		validateConfig();
		console.log(`[SegfaultAPI] listening on ${address}`);
	}
);
