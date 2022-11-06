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
	const plausible = await fetch(
		"https://analytics.projectsegfau.lt/projectsegfau.lt"
	);

	const status = {
		"General": [
            {
                name: "Invidious",
                description: "A frontend for YouTube.",
                link: "https://invidious.projectsegfau.lt/",
                project: "https://invidious.io/",
                icon: "https://github.com/iv-org/invidious/raw/master/assets/invidious-colored-vector.svg",
                status: invidious.status
            },
            {
                name: "Librarian",
                description: "A frontend for Odysee.",
                link: "https://lbry.projectsegfau.lt/",
                project: "https://codeberg.org/librarian/librarian",
                icon: "https://codeberg.org/avatars/dd785d92b4d4df06d448db075cd29274",
                status: librarian.status
            },
            {
                name: "Libreddit",
                description: "A frontend for Reddit.",
                link: "https://libreddit.projectsegfau.lt/",
                project: "https://github.com/spikecodes/libreddit",
                icon: "https://github.com/spikecodes/libreddit/raw/master/static/logo.png",
                status: libreddit.status
            },
            {
                name: "Nitter",
                description: "A frontend for Twitter.",
                link: "https://nitter.projectsegfau.lt/",
                project: "https://github.com/zedeus/nitter",
                icon: "https://github.com/zedeus/nitter/raw/master/public/logo.png",
                status: nitter.status
            },
            {
                name: "Element",
                description: "An open source and decentralized chat application.",
                link: "https://chat.projectsegfau.lt/",
                project: "https://element.io/",
                icon: "https://element.io/images/logo-mark-primary.svg",
                status: element.status
            },
            {
                name: "Piped",
                description: "Another frontend for YouTube.",
                link: "https://piped.projectsegfau.lt/",
                project: "https://github.com/TeamPiped/Piped",
                icon: "https://github.com/TeamPiped/Piped/raw/master/public/img/icons/logo.svg",
                status: piped.status
            },
            {
                name: "SearXNG",
                description: "A private meta-search engine.",
                link: "https://search.projectsegfau.lt/search",
                project: "https://searxng.org/",
                icon: "https://docs.searxng.org/_static/searxng-wordmark.svg",
                status: searxng.status
            },
            {
                name: "Gitea",
                description: "A web interface for Git, alternative to GitHub.",
                link: "https://git.projectsegfau.lt/",
                project: "https://gitea.io/",
                icon: "https://gitea.io/images/gitea.png",
                status: gitea.status
            }
        ],
		"Internal": [
            {
                name: "Portainer",
                description: "Portainer instance for our servers.",
                link: "https://portainer.projectsegfau.lt/",
                project: "https://www.portainer.io/",
                icon: "https://avatars.githubusercontent.com/u/22225832",
                status: portainer.status
            },
            {
                name: "mailcow",
                description: "Our mail server and webmail.",
                link: "https://mail.projectsegfau.lt/",
                project: "https://mailcow.email/",
                icon: "https://mailcow.email/images/cow_mailcow.svg",
                status: mailcow.status
            },
            {
                name: "Plausible analytics",
                description: "Analytics for our website.",
                link: "https://analytics.projectsegfau.lt/projectsegfau.lt",
                project: "https://plausible.io/",
                icon: "https://avatars.githubusercontent.com/u/54802774",
                status: plausible.status
            }
        ]
    };

    
	return {
        status: status,
        updated: updated
    }
};

export default statusApi;
