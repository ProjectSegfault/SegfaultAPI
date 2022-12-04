import type { FastifyRequest } from "fastify";
import requestIp from "request-ip";

const getIP = (request: FastifyRequest) => {
	let ipAddress = requestIp.getClientIp(request);
	return ipAddress;
};

export default getIP;
