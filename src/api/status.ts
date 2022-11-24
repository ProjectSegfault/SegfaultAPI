import ping from "../utils/ping";

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
					status: await ping("invidious.projectsegfau.lt"),
                    statusUs: await ping("inv.us.projectsegfau.lt"),
                    statusBp: await ping("inv.bp.projectsegfau.lt")
				},
				{
					name: "Librarian",
					description: "A frontend for Odysee.",
					link: "https://lbry.projectsegfau.lt/",
					icon: "https://codeberg.org/avatars/dd785d92b4d4df06d448db075cd29274",
					status: await ping("lbry.projectsegfau.lt")
				},
				{
					name: "Libreddit",
					description: "A frontend for Reddit.",
					link: "https://libreddit.projectsegfau.lt/",
                    us: "https://libreddit.us.projectsegfau.lt",
					icon: "https://github.com/spikecodes/libreddit/raw/master/static/logo.png",
					status: await ping("libreddit.projectsegfau.lt"),
                    statusUs: await ping("libreddit.us.projectsegfau.lt")
				},
				{
					name: "Nitter",
					description: "A frontend for Twitter.",
					link: "https://nitter.projectsegfau.lt/",
                    us: "https://nitter.us.projectsegfau.lt",
					icon: "https://github.com/zedeus/nitter/raw/master/public/logo.png",
					status: await ping("nitter.projectsegfau.lt"),
                    statusUs: await ping("nitter.us.projectsegfau.lt")
				},
				{
					name: "Element",
					description:
						"An open source and decentralized chat application.",
					link: "https://chat.projectsegfau.lt/",
					icon: "https://element.io/images/logo-mark-primary.svg",
					status: await ping("chat.projectsegfau.lt")
				},
				{
					name: "Piped",
					description: "Another frontend for YouTube.",
					link: "https://piped.projectsegfau.lt/",
                    us: "https://piped.us.projectsegfau.lt",
					icon: "https://github.com/TeamPiped/Piped/raw/master/public/img/icons/logo.svg",
					status: await ping("piped.projectsegfau.lt"),
                    statusUs: await ping("piped.us.projectsegfau.lt")
				},
				{
					name: "SearXNG",
					description: "A private meta-search engine.",
					link: "https://search.projectsegfau.lt/search",
                    us: "https://search.us.projectsegfau.lt",
					icon: "https://docs.searxng.org/_static/searxng-wordmark.svg",
					status: await ping("search.projectsegfau.lt"),
                    statusUs: await ping("search.us.projectsegfau.lt")
				},
				{
					name: "Gitea",
					description:
						"A web interface for Git, alternative to GitHub.",
					link: "https://git.projectsegfau.lt/",
					icon: "https://gitea.io/images/gitea.png",
					status: await ping("git.projectsegfau.lt")
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
					status: await ping("portainer.projectsegfau.lt")
				},
				{
					name: "mailcow",
					description: "Our mail server and webmail.",
					link: "https://mail.projectsegfau.lt/",
					icon: "https://mailcow.email/images/cow_mailcow.svg",
					status: await ping("mail.projectsegfau.lt")
				},
				{
					name: "Plausible analytics",
					description: "Analytics for our website.",
					link: "https://analytics.projectsegfau.lt/projectsegfau.lt",
					icon: "https://avatars.githubusercontent.com/u/54802774",
					status: await ping("analytics.projectsegfau.lt")
				}
			]
		}
	];

	return {
		status: status,
		updated: Math.floor(Date.now() / 1000)
	};
};

export default statusApi;
