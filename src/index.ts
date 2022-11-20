import * as dotenv from "dotenv";

dotenv.config();

import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import pointOfView from "@fastify/view";
import Handlebars from "handlebars";
import statusApi from "./api/status";
import announcementsApi from "./api/announcements";
import formApi from "./api/form";
import validateConfig from "./utils/validateConfig";
import log from "./utils/logUtil";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
	logger: process.env.NODE_ENV === "production" ? false : true
});

fastify.register(formBodyPlugin);

fastify.register(fastifySensible);

fastify.register(cors, {
	origin: "*"
});

fastify.register(pointOfView, {
    engine: {
        handlebars: Handlebars
    },
    root: join(__dirname, "templates"),
    layout: "layout",
    viewExt: "hbs"
})

fastify.get("/", (request, reply) => {
	reply.view("index", { port: process.env.PORT, title: "index" });
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
		log("Listening on http://localhost:" + process.env.PORT);
	}
);
