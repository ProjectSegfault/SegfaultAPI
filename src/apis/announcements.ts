import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import log from "../utils/logUtil";
import { db, initializeDb, closeDb } from "../utils/db";
import { userMap } from "./user";
import config from "../utils/config";

interface BodyType {
	title: string;
	severity: string;
	author: string;
	link?: string;
}

const announcementsApi = (fastify: FastifyInstance) => {
	if (!config.app.state.announcements) {
		log("The announcements api is disabled.", "warning");
		fastify.get(
			"/tools/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The announcements api is disabled.");
			}
		);

		fastify.get(
			"/api/v1/state/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: false });
			}
		);

		fastify.get(
			"/api/v1/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The announcements api is disabled.");
			}
		);
	} else {
		fastify.get(
			"/tools/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				reply.view("announcements", {
					title: "announcement command centre"
				});
			}
		);

		fastify.get(
			"/api/v1/state/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: true });
			}
		);

		fastify.get(
			"/api/v1/announcements",
			(request: FastifyRequest, reply: FastifyReply) => {
				readAnnouncements(request, reply);
			}
		);
		fastify.post(
			"/api/v1/announcements/post",
			(
				request: FastifyRequest<{ Body: BodyType }>,
				reply: FastifyReply
			) => {
				setAnnouncements(request, reply);
			}
		);
		fastify.post(
			"/api/v1/announcements/delete",
			(
				request: FastifyRequest<{ Body: BodyType }>,
				reply: FastifyReply
			) => {
				deleteAnnouncements(request, reply);
			}
		);
	}
};

const setAnnouncements = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isLoggedIn")) {
		if (
			request.body.title === "" ||
			request.body.severity === "" ||
			request.body.author === ""
		) {
			reply.badRequest(
				"Your request is not proper. Please add a title, severity and author."
			);
		} else {
			const collection = db.collection("announcements");

			const now = Math.floor(Date.now() / 1000);
			const data = {
				title: request.body.title,
				link: request.body.link,
				severity: request.body.severity,
				author: request.body.author,
				created: now
			};

			await collection.deleteMany({});

			await collection.insertOne(data);

			reply.status(200).send("Your announcement has been posted.");
		}
	} else {
		reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
	}

	closeDb();
};

const deleteAnnouncements = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("announcements");

		await collection.deleteMany({});

		reply.status(200).send("Your announcement has been deleted.");
	} else {
		reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
	}

	closeDb();
};

const readAnnouncements = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	initializeDb();

	const collection = db.collection("announcements");

	await collection
		.find({}, { projection: { _id: false } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no announcements.");
			} else {
				reply.send(data[0]);
			}
		});

	closeDb();
};

export default announcementsApi;
