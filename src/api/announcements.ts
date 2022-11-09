import fs from "fs";

const announcementsApi = (fastify) => {
	if (process.env.ANNOUNCEMENTS_STATE === "0") {
		console.log("[SegfaultAPI] The announcements api is disabled.");
		fastify.get("/tools/announcements", async (request, reply) => {
			reply.send("The announcements api is disabled.");
		});
		fastify.get("/api/v1/state/announcements", async (request, reply) => {
			reply.send({ enabled: false });
		});
	} else {
		fastify.get("/tools/announcements", (request, reply) => {
			reply.sendFile("tools/announcements.html");
		});
		fastify.get("/api/v1/state/announcements", async (request, reply) => {
			reply.send({ enabled: true });
		});

		fastify.get("/api/v1/announcements", (request, reply) => {
			getAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/post", (request, reply) => {
			handleAnnouncements(request, reply);
		});
		fastify.post("/api/v1/announcements/delete", (request, reply) => {
			handleAnnouncementDeleteRequest(request, reply);
		});
	}
};

const getAnnouncements = async (request, reply) => {
	if (fs.existsSync("./data/announcements.json")) {
		if (fs.readFileSync("./data/announcements.json", "utf8").length === 0) {
			reply.send("There are no announcements.");
			return;
		} else {
			reply.send(
				JSON.parse(fs.readFileSync("./data/announcements.json", "utf8"))
			);
		}
	} else {
		reply.send("There are no announcements.");
		return;
	}
};

const handleAnnouncements = async (request, reply) => {
	if (request.body.token !== process.env.TOKEN) {
		reply.unauthorized(
			"You need to provide the authorization token given to you by your system administrator in order to post an announcement."
		);
		return;
	} else {
		if (request.body.title === "" || request.body.severity === "" || request.body.author === "") {
			reply.badRequest(
				"Your request is not proper. Please add a title, severity and author."
			);
			return;
		} else {
			reply.status(200).send("Your announcement has been posted.");
			const now = Math.floor(Date.now() / 1000);
			const data = {
				title: request.body.title,
				link: request.body.link,
				severity: request.body.severity,
				author: request.body.author,
				created: now
			};

			const stringData = JSON.stringify(data);
			fs.writeFile("./data/announcements.json", stringData, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		return;
	}
};

const handleAnnouncementDeleteRequest = async (request, reply) => {
	if (request.body.token !== process.env.TOKEN) {
		reply.unauthorized(
			"You need to provide the authorization token given to you by your system administrator in order to delete an announcement."
		);
		return;
	} else {
		reply.status(200).send("Your announcement has been deleted.");
		fs.writeFile("./data/announcements.json", "", (err) => {
			if (err) {
				console.error(err);
			}
		});
		return;
	}
};

export default announcementsApi;
