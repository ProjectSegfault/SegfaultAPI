import express from "express";
import config from "../segfautils.config.json";
const app = express();
const port = config.port;
import statusApi from "./api/status";
import announcementsApi from "./api/announcements";
import formApi from "./api/form";

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
	res.sendFile("./public/index.html", { root: "./" });
});

announcementsApi(app);
formApi(app);

const map = new Map();

const updateMap = () => map.set("data", statusApi());

updateMap();

setInterval(updateMap, 30000);

app.get("/api/v1/status", async (req, res) => {
	res.json(await map.get("data"));
});

app.listen(port, () => {
	console.log(`[Segfautils] listening on port ${port}`);
});
