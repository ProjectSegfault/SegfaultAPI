import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import log from "../utils/logUtil";

const announcementsApi = (fastify: FastifyInstance) => {
	if (process.env.ANNOUNCEMENTS_STATE === "0") {
		log("The announcements api is disabled.", "warning");
		fastify.get("/tools/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send("The announcements api is disabled.");
		});

		fastify.get("/api/v1/state/announcements", async (request: FastifyRequest, reply: FastifyReply) => {
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

		fastify.get("/api/v1/state/announcements", async (request: FastifyRequest, reply: FastifyReply) => {
			reply.send({ enabled: true });
		});

		fastify.get("/api/v1/announcements", (request: FastifyRequest, reply: FastifyReply) => {
			getAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/post", (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			handleAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/delete", (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			handleAnnouncementDeleteRequest(request, reply);
		});
	}
};

const getAnnouncements = async (request: FastifyRequest, reply: FastifyReply) => {
	if (fs.existsSync("./data/announcements.json")) {
		if (fs.readFileSync("./data/announcements.json", "utf8").length === 0) {
			reply.notFound("There are no announcements.");
			return;
		} else {
			reply.send(
				JSON.parse(fs.readFileSync("./data/announcements.json", "utf8"))
			);
		}
	} else {
		reply.notFound("There are no announcements.");
		return;
	}
};

interface BodyType {
    token: string;
    title: string;
    severity: string;
    author: string;
    link?: string;
}

const handleAnnouncements = async (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
	if (request.body.token !== process.env.TOKEN) {
		reply.unauthorized(
			"You need to provide the authorization token given to you by your system administrator in order to post an announcement."
		);
		return;
	} else {
		if (
			request.body.title === "" ||
			request.body.severity === "" ||
			request.body.author === ""
		) {
			reply.badRequest(
				"Your request is not proper. Please add a title, severity and author."
			);
			return;
		} else {
			reply.status(200).send("Your announcement has been posted.");
			const now = Math.floor(Date.now() / 1000);
			const data = {
				title: request.body.title,
				link: request.body.link,
				severity: request.body.severity,
				author: request.body.author,
				created: now
			};

			const stringData = JSON.stringify(data);
			fs.writeFileSync("./data/announcements.json", stringData);
		}
		return;
	}
};

const handleAnnouncementDeleteRequest = async (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
	if (request.body.token !== process.env.TOKEN) {
		reply.unauthorized(
			"You need to provide the authorization token given to you by your system administrator in order to delete an announcement."
		);
		return;
	} else {
		reply.status(200).send("Your announcement has been deleted.");
		fs.writeFileSync("./data/announcements.json", "");
		return;
	}
};

export default announcementsApi;
