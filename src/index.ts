import express from "express";
import config from "../config.json";
import statusApi from "./api/status";
import announcementsApi from "./api/announcements";
import formApi from "./api/form";
import validateConfig from "./utils/validateConfig";
import expressStatusMonitor from "express-status-monitor";

const app = express();

app.use(expressStatusMonitor({
    title: "SegfaultAPI stats",
    path: "/stats"
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile("./public/index.html", { root: "./" });
});

app.get("/global.css", (req, res) => {
	res.sendFile("./public/global.css", { root: "./" });
});

announcementsApi(app);
formApi(app);
statusApi(app);

app.listen(config.port, () => {
    validateConfig();
	console.log(`[SegfaultAPI] listening on port http://localhost:${config.port}`);
});
