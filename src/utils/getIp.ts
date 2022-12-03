import requestIp from "request-ip";

const getIP = (request) => {
	let ipAddress = requestIp.getClientIp(request);
	return ipAddress;
};

export default getIP;
