import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import statusData from "../constants/statusData";
import config from "../utils/config";

const statusApi = async (fastify: FastifyInstance) => {
	if (!config.app.state.status) {
		fastify.get("/api/v1/status", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send("The status api is disabled.");
		});
		fastify.get("/api/v1/state/status", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send({ enabled: false });
		});
	} else {
		fastify.get("/api/v1/status", (request: FastifyRequest, reply: FastifyReply) => {
			setData(request, reply);
		});

		fastify.get("/api/v1/state/status", (request: FastifyRequest, reply: FastifyReply) => {
			reply.send({ enabled: true });
		});
	}
};

const setData = (request: FastifyRequest, reply: FastifyReply) => {
	const map = new Map();

	const updateMap = () => {
		map.set("data", {
			status: statusData,
			updated: Math.floor(Date.now() / 1000)
		});
	};

	updateMap();

	setInterval(updateMap, 30000);

	reply.send(map.get("data"));
}

export default statusApi;
