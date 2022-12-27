import axios from "axios";

const fetchStatus = (domain: string) => {
	const req = axios("https://" + domain, { timeout: 10000 })
		.then((res) => res.status)
		.catch((err) => err.response.status);

	return req;
};

export default fetchStatus;
