import { MongoClient } from "mongodb";
import isDocker from "is-docker";
import config from "./config";
import log from "./logUtil";

const mongoClient = new MongoClient(
	isDocker() ? config.db.url.docker : config.db.url.local
);

const mongoName: string = "segfaultapi";

export const db = mongoClient.db(mongoName);

export const initializeDb = async () => {
	await mongoClient
		.connect()
		.then(() => {
			log("Connected to MongoDB", "info");
		})
		.catch((err) => {
			log("Error connecting to MongoDB", "error");
			log(err, "error");
		});
};

export const closeDb = async () => {
	await mongoClient
		.close()
		.then(() => {
			log("Disconnected from MongoDB", "info");
		})
		.catch((err) => {
			log("Error disconnecting from MongoDB", "error");
			log(err, "error");
		});
};
