import ping from "ping";

const statusApi = async (fastify) => {
	const map = new Map();

	const updateMap = () => map.set("data", fetchData());

	updateMap();

	setInterval(updateMap, 30000);

	fastify.get("/api/v1/status", async (request, reply) => {
		reply.send(await map.get("data"));
	});
};

const fetchData = async () => {
	const updated = Math.floor(Date.now() / 1000);
	const invidious = await ping.promise.probe("invidious.projectsegfau.lt");
    const invUs = await ping.promise.probe("inv.us.projectsegfau.lt");
    const invBp = await ping.promise.probe("inv.bp.projectsegfau.lt");
	const librarian = await ping.promise.probe("lbry.projectsegfau.lt");
	const libreddit = await ping.promise.probe("libreddit.projectsegfau.lt");
    const libredditUs = await ping.promise.probe("libreddit.us.projectsegfau.lt");
	const nitter = await ping.promise.probe("nitter.projectsegfau.lt");
    const nitterUs = await ping.promise.probe("nitter.us.projectsegfau.lt");
	const element = await ping.promise.probe("chat.projectsegfau.lt");
	const piped = await ping.promise.probe("piped.projectsegfau.lt");
    const pipedUs = await ping.promise.probe("piped.us.projectsegfau.lt");
	const searxng = await ping.promise.probe("search.projectsegfau.lt");
    const searxngUs = await ping.promise.probe("search.us.projectsegfau.lt");
	const gitea = await ping.promise.probe("git.projectsegfau.lt");
	const portainer = await ping.promise.probe("portainer.projectsegfau.lt");
	const mailcow = await ping.promise.probe("projectsegfau.lt");
	const plausible = await ping.promise.probe("analytics.projectsegfau.lt");

	const status = [
		{
			name: "General",
			data: [
				{
					name: "Invidious",
					description: "A frontend for YouTube.",
					link: "https://invidious.projectsegfau.lt/",
                    us: "https://inv.us.projectsegfau.lt",
                    bp: "https://inv.bp.projectsegfau.lt",
					icon: "https://github.com/iv-org/invidious/raw/master/assets/invidious-colored-vector.svg",
					status: invidious.alive,
                    statusUs: invUs.alive,
                    statusBp: invBp.alive
				},
				{
					name: "Librarian",
					description: "A frontend for Odysee.",
					link: "https://lbry.projectsegfau.lt/",
					icon: "https://codeberg.org/avatars/dd785d92b4d4df06d448db075cd29274",
					status: librarian.alive
				},
				{
					name: "Libreddit",
					description: "A frontend for Reddit.",
					link: "https://libreddit.projectsegfau.lt/",
                    us: "https://libreddit.us.projectsegfau.lt",
					icon: "https://github.com/spikecodes/libreddit/raw/master/static/logo.png",
					status: libreddit.alive,
                    statusUs: libredditUs.alive
				},
				{
					name: "Nitter",
					description: "A frontend for Twitter.",
					link: "https://nitter.projectsegfau.lt/",
                    us: "https://nitter.us.projectsegfau.lt",
					icon: "https://github.com/zedeus/nitter/raw/master/public/logo.png",
					status: nitter.alive,
                    statusUs: nitterUs.alive
				},
				{
					name: "Element",
					description:
						"An open source and decentralized chat application.",
					link: "https://chat.projectsegfau.lt/",
					icon: "https://element.io/images/logo-mark-primary.svg",
					status: element.alive
				},
				{
					name: "Piped",
					description: "Another frontend for YouTube.",
					link: "https://piped.projectsegfau.lt/",
                    us: "https://piped.us.projectsegfau.lt",
					icon: "https://github.com/TeamPiped/Piped/raw/master/public/img/icons/logo.svg",
					status: piped.alive,
                    statusUs: pipedUs.alive
				},
				{
					name: "SearXNG",
					description: "A private meta-search engine.",
					link: "https://search.projectsegfau.lt/search",
                    us: "https://search.us.projectsegfau.lt",
					icon: "https://docs.searxng.org/_static/searxng-wordmark.svg",
					status: searxng.alive,
                    statusUs: searxngUs.alive
				},
				{
					name: "Gitea",
					description:
						"A web interface for Git, alternative to GitHub.",
					link: "https://git.projectsegfau.lt/",
					icon: "https://gitea.io/images/gitea.png",
					status: gitea.alive
				}
			]
		},
		{
			name: "Internal",
			data: [
				{
					name: "Portainer",
					description: "Portainer instance for our servers.",
					link: "https://portainer.projectsegfau.lt/",
					icon: "https://avatars.githubusercontent.com/u/22225832",
					status: portainer.alive
				},
				{
					name: "mailcow",
					description: "Our mail server and webmail.",
					link: "https://mail.projectsegfau.lt/",
					icon: "https://mailcow.email/images/cow_mailcow.svg",
					status: mailcow.alive
				},
				{
					name: "Plausible analytics",
					description: "Analytics for our website.",
					link: "https://analytics.projectsegfau.lt/projectsegfau.lt",
					icon: "https://avatars.githubusercontent.com/u/54802774",
					status: plausible.alive
				}
			]
		}
	];

	return {
		status: status,
		updated: updated
	};
};

export default statusApi;
