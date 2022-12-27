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
import userApi, { userMap } from "./apis/user";
import blogApi from "./apis/blog";
import log from "./utils/logUtil";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import config from "./utils/config";
import { initializeDb, dbCleanUp, db } from "./utils/db";
import getIp from "./utils/getIp";

const __dirname = dirname(fileURLToPath(import.meta.url));

let isProd = process.env["NODE_ENV"] === "production" ? true : false;

const fastify: FastifyInstance = Fastify({
	logger: true
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
	defaultContext: {
		isIndex: false,
		isLoggedIn: userMap.get("isLoggedIn"),
		isUser: false
	},
	viewExt: "hbs"
});

fastify.addHook(
	"preHandler",
	async (request: FastifyRequest, reply: FastifyReply) => {
		const collection = db.collection("banned");

		if (
			getIp(request) ===
			(await collection
				.findOne({ ip: getIp(request) })
				.then((doc) => doc?.["ip"]))
		) {
			reply.unauthorized("You are banned.");
		}
	}
);

fastify.get("/", (_request: FastifyRequest, reply: FastifyReply) => {
	reply.view("index", {
		port: config.app.port,
		title: "index",
		announcementsEnabled: config.app.state.announcements,
		formEnabled: config.app.state.form,
		statusEnabled: config.app.state.status,
		blogEnabled: config.app.state.blog,
		isIndex: true,
		env: isProd ? "production" : "development"
	});
});

initializeDb();

announcementsApi(fastify);
formApi(fastify);
statusApi(fastify);
userApi(fastify);
blogApi(fastify);

fastify.listen(
	{ port: config.app.port, host: isProd ? "0.0.0.0" : "localhost" },
	(err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		log("Listening on " + address);
	}
);

process.on("SIGINT", () => {
	dbCleanUp();
	process.exit(0);
});

process.on("SIGTERM", () => {
	dbCleanUp();
	process.exit(0);
});
