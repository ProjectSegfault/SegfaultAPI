const statusApi = async () => {
	const updated = Math.floor(Date.now() / 1000);
	const invidious = await fetch("https://inv.odyssey346.dev/api/v1/stats");
	const ferrit = await fetch("https://fr.odyssey346.dev/");
	const quetre = await fetch("https://qtr.odyssey346.dev/");
	const breezewiki = await fetch("https://bw.odyssey346.dev/");
	const rimgo = await fetch("https://rim.odyssey346.dev/");
	const proxitok = await fetch("https://proxitok.odyssey346.dev/");
	const nitter = await fetch("https://ntr.odyssey346.dev/");
	const memestream = await fetch("https://ms.odyssey346.dev/");
	const services = await fetch("https://services.odyssey346.dev/");

	const status = [
		{ name: "Invidious", status: invidious.status },
		{ name: "ferrit", status: ferrit.status },
		{ name: "quetre", status: quetre.status },
		{ name: "breezewiki", status: breezewiki.status },
		{ name: "rimgo", status: rimgo.status },
		{ name: "proxitok", status: proxitok.status },
		{ name: "nitter", status: nitter.status },
		{ name: "memestream", status: memestream.status },
		{ name: "services", status: services.status }
	];
	return {
		status: status,
		updated: updated
	};
};

export default statusApi;
