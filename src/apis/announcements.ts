import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import log from "../utils/logUtil";
import { setAnnouncements, deleteAnnouncements, readAnnouncements } from "../utils/db";
import config from "../utils/config";

export interface BodyType {
    title: string;
    severity: string;
    author: string;
    link?: string;
}

const announcementsApi = (fastify: FastifyInstance) => {
	if (!config.app.state.announcements) {
		log("The announcements api is disabled.", "warning");
		fastify.get("/tools/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send("The announcements api is disabled.");
		});

		fastify.get("/api/v1/state/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send({ enabled: false });
		});

		fastify.get("/api/v1/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send("The announcements api is disabled.");
		});
	} else {
		fastify.get("/tools/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.view("announcements", {
				title: "announcement command centre"
			});
		});

		fastify.get("/api/v1/state/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send({ enabled: true });
		});

		fastify.get("/api/v1/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			readAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/post", (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			setAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/delete", (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			deleteAnnouncements(request, reply);
		});
	}
};

export default announcementsApi;
