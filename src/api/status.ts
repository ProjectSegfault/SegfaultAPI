import statusData from "../utils/defineStatusData";

const statusApi = async (fastify) => {
	const map = new Map();

	const updateMap = () => map.set("data", fetchData());

	updateMap();

	setInterval(updateMap, 30000);

	fastify.get("/api/v1/status", (request, reply) => {
		reply.send(map.get("data"));
	});
};

const fetchData = () => {
	return {
		status: statusData,
		updated: Math.floor(Date.now() / 1000)
	};
};

export default statusApi;
