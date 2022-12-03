import axios from "axios";

const fetchStatus = (domain: string) => {
	const req = axios("https://" + domain, { timeout: 10000 })
		.then((res) => res.status)
		.then((statusCode) => (statusCode === 200 ? true : false))
		.catch(() => false);

	return req;
};

export default fetchStatus;
