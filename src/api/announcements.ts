import fs from "fs";
import config from "../../segfautils.config.json";

const announcementsApi = (app) => {
	if (config.state.announcements === false) {
		console.log("[Segfautils] The announcements api is disabled.");
		app.get("/tools/announcements", async (req, res) => {
			res.send("The announcements api is disabled.");
		});
		app.get("/api/v1/state/announcements", async (req, res) => {
			res.json({ enabled: false });
		});
	} else {
		app.get("/tools/announcements", (req, res) => {
			res.sendFile("./public/tools/announcements.html", { root: "./" });
		});
		app.get("/api/v1/state/announcements", async (req, res) => {
			res.json({ enabled: true });
		});

		app.get("/api/v1/announcements", (req, res) => {
			getAnnouncements(req, res, app);
		});
		app.post("/api/v1/announcements/post", (req, res, config) => {
			handleAnnouncements(req, res);
		});
		app.post("/api/v1/announcements/delete", (req, res) => {
			handleAnnouncementDeleteRequest(req, res);
		});
	}
};

const getAnnouncements = async (req, res, app) => {
	const file = fs.readFileSync("./data/announcements.json", "utf8");
	if (file.length === 0) {
		res.status(404).send("There are no announcements.");
		return;
	} else {
		res.json(JSON.parse(file));
	}
};

const handleAnnouncements = async (req, res) => {
	if (req.body.token !== config.token) {
		res.status(403).send(
			"You need to provide the authorization token given to you by your system administrator in order to post an announcement."
		);
		return;
	} else {
		if (req.body.title === "" || req.body.severity === "") {
			res.status(400).send(
				"Your request is not proper. Please add a title and severity."
			);
			return;
		} else {
			res.status(200).send("Your announcement has been posted.");
			const now = Math.floor(Date.now() / 1000);
			const data = {
				title: req.body.title,
				link: req.body.link,
				severity: req.body.severity,
				created: now
			};

			const stringData = JSON.stringify(data);
			fs.appendFile("./data/announcements.json", stringData, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		return;
	}
};

const handleAnnouncementDeleteRequest = async (req, res) => {
	if (req.body.token !== config.token) {
		res.status(403).send(
			"You need to provide the authorization token given to you by your system administrator in order to delete an announcement."
		);
		return;
	} else {
		res.status(200).send("Your announcement has been deleted.");
		fs.writeFile("./data/announcements.json", "", (err) => {
			if (err) {
				console.error(err);
			}
		});
		return;
	}
};

export default announcementsApi;
