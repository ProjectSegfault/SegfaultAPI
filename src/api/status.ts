const statusApi = async (app) => {
    const map = new Map();

    const updateMap = () => map.set("data", fetchData());

    updateMap();

    setInterval(updateMap, 30000);

    app.get("/api/v1/status", async (req, res) => {
        res.json(await map.get("data"));
    });
};

const fetchData = async () => {
    const updated = Math.floor(Date.now() / 1000);
	const invidious = await fetch("https://invidious.projectsegfau.lt/");
	const librarian = await fetch("https://lbry.projectsegfau.lt/");
	const libreddit = await fetch("https://libreddit.projectsegfau.lt/");
	const nitter = await fetch("https://nitter.projectsegfau.lt/");
	const element = await fetch("https://chat.projectsegfau.lt/");
	const piped = await fetch("https://piped.projectsegfau.lt/");
	const searxng = await fetch("https://search.projectsegfau.lt/search");
	const gitea = await fetch("https://git.projectsegfau.lt/");
	const portainer = await fetch("https://portainer.projectsegfau.lt/");
	const mailcow = await fetch("https://mail.projectsegfau.lt/");
	const plausible = await fetch("https://analytics.projectsegfau.lt/projectsegfau.lt");

	const status = [
		{ name: "Invidious", status: invidious.status },
		{ name: "Librarian", status: librarian.status },
		{ name: "Libreddit", status: libreddit.status },
		{ name: "Nitter", status: nitter.status },
		{ name: "Element", status: element.status },
		{ name: "Piped", status: piped.status },
		{ name: "SearXNG", status: searxng.status },
		{ name: "Gitea", status: gitea.status },
		{ name: "Portainer", status: portainer.status },
        { name: "mailcow", status: mailcow.status },
		{ name: "Plausible analytics", status: plausible.status }
	];
	return {
		status: status,
		updated: updated
	};
}

export default statusApi;
