import * as dotenv from "dotenv";

dotenv.config();

import Fastify from "fastify";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import formBodyPlugin from "@fastify/formbody";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import pointOfView from "@fastify/view";
import Handlebars from "handlebars";
import statusApi from "./apis/status";
import announcementsApi from "./apis/announcements";
import formApi from "./apis/form";
import validateConfig from "./utils/validateConfig";
import log from "./utils/logUtil";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let isProd = process.env.NODE_ENV === "production" ? true : false;

const fastify: FastifyInstance = Fastify({
	logger: isProd ? true : false
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
});

fastify.get("/", (request: FastifyRequest, reply: FastifyReply) => {
	reply.view("index", {
		port: process.env.PORT,
		title: "index",
		announcementsEnabled: Number(process.env.ANNOUNCEMENTS_STATE),
		formEnabled: Number(process.env.FORM_STATE)
	});
});

announcementsApi(fastify);
formApi(fastify);
statusApi(fastify);

fastify.listen(
	{ port: Number(process.env.PORT), host: isProd ? "0.0.0.0" : "localhost" },
	(err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		validateConfig();
		log("Listening on " + address);
	}
);
