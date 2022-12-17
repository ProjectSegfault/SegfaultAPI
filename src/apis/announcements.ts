import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import log from "../utils/logUtil";
import { db } from "../utils/db";
import { userMap } from "./user";
import config from "../utils/config";
import Joi from "joi";

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

interface BodyType {
	title: string;
	severity: string;
	author: string;
	link?: string;
}

const BodyTypeSchema = Joi.object({
	title: Joi.string().required(),
	severity: Joi.string().required(),
	author: Joi.string().required(),
	link: Joi.string().optional().allow("")
});

const setAnnouncements = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {

	if (userMap.get("isLoggedIn")) {
		if (
			BodyTypeSchema.validate(request.body).error
		) {
			reply.badRequest(
				`${BodyTypeSchema.validate(request.body).error}`
			);
		} else {
			const collection = db.collection("announcements");

			const now = Math.floor(Date.now() / 1000);
			const data = {
				...request.body,
				created: now
			};

			await collection.deleteMany({});

			await collection.insertOne(data);

			reply.send("Your announcement has been posted.");
		}
	} else {
		reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
	}
};

const deleteAnnouncements = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {

	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("announcements");

		await collection.deleteMany({});

		reply.send("Your announcement has been deleted.");
	} else {
		reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
	}
};

const readAnnouncements = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {

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
};

export default announcementsApi;
