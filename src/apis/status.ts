import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import statusData from "../constants/statusData";

const statusApi = async (fastify: FastifyInstance) => {
	const map = new Map();

	const updateMap = () => {
		map.set("data", {
			status: statusData,
			updated: Math.floor(Date.now() / 1000)
		});
	};

	updateMap();

	setInterval(updateMap, 30000);

	fastify.get("/api/v1/status", (request: FastifyRequest, reply: FastifyReply) => {
		reply.send(map.get("data"));
	});
};

export default statusApi;
