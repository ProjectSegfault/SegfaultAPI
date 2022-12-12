import type { FastifyReply, FastifyRequest } from "fastify";
import { MongoClient } from "mongodb"
import type { BodyType } from "../apis/announcements";
import bcrypt from "bcrypt";
import isDocker from "is-docker";
import config from "./config";

const mongoClient = new MongoClient(isDocker() ? config.db.url.docker : config.db.url.local );

const mongoName: string = "segfaultapi";

const db = mongoClient.db(mongoName);

export const userMap = new Map();

const isAdmin = userMap.get("isAdmin");

export const initializeDb = async () => {
    await mongoClient.connect();
}

export const closeDb = async () => {
    await mongoClient.close();
}

export const setAnnouncements = async (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {

    if (userMap.get("isLoggedIn")) {
        if (
			request.body.title === "" ||
			request.body.severity === "" ||
			request.body.author === ""
		) {
			reply.badRequest(
				"Your request is not proper. Please add a title, severity and author."
			);
		} else {
            const collection = db.collection("announcements");

            const now = Math.floor(Date.now() / 1000);
            const data = {
                title: request.body.title,
                link: request.body.link,
                severity: request.body.severity,
                author: request.body.author,
                created: now
            };
        
            await collection.deleteMany({});
        
            await collection.insertOne(data);

            reply.status(200).send("Your announcement has been posted.");
		}
    } else {
        reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
    }

}

export const deleteAnnouncements = async (request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {

    if (userMap.get("isLoggedIn")) {
        const collection = db.collection("announcements");

        await collection.deleteMany({});
    } else {
        reply.unauthorized(
			"You need to log in in order to post an announcement."
		);
    }

}

export const readAnnouncements = async (request: FastifyRequest, reply: FastifyReply) => {

    const collection = db.collection("announcements");

    await collection.find({}, { projection: { _id: false } }).toArray().then((data) => {
        if ( data.length === 0 || data[0] === undefined) {
            reply.notFound("There are no announcements.");
        } else {
            reply.send(data);
        }
    });

}

export interface UserBodyType {
    username: string;
    password: string;
}

export const userSignup = async (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {

    if (userMap.get("isAdmin")) {
        const collection = db.collection("users");

        const data = {
            username: request.body.username,
            password: bcrypt.hashSync(request.body.password, 10)
        };
    
        if (await collection.findOne({ username: request.body.username })) {
            reply.send("User already exists.");
        } else {    
            await collection.insertOne(data).then((result) => {
                if (result.insertedId !== undefined) {
                    reply.send("User created.");
                } else {
                    reply.send("An error occurred.");
                }
            });
        }
    } else {
        reply.unauthorized("You need to be an admin to create a user.");
    }

}

export const userLogin = async (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {

    const collection = db.collection("users");

    const data = await collection.find({ username: request.body.username }, { projection: { _id: false } }).toArray();

    if (data === undefined) {
        reply.send("User does not exist.")
    } else {
        bcrypt.compare(request.body.password, data[0]?.["password"], (err, result) => {
            if (err) {
                reply.send("An error occurred.");
            } else {
                if (result) {
                    userMap.set("isLoggedIn", true);
                    userMap.set("username", request.body.username);
                    if (request.body.username === "admin") {
                        userMap.set("isAdmin", true);
                    } else {
                        userMap.set("isAdmin", false);
                    }
                    reply.send("User logged in.");
                } else {
                    reply.send("Incorrect password.");
                }
            }
        });
    }

}

export const userDelete = async (request: FastifyRequest<{ Body: UserBodyType }> ,reply: FastifyReply) => {

    if (userMap.get("isLoggedIn")) {
        const collection = db.collection("users");

        await collection.deleteOne({ username: isAdmin ? request.body.username : userMap.get("username")  }).then((result) => {
            if (result.deletedCount === 1) {
                reply.send("User deleted.");
            } else {
                reply.send("User does not exist.");
            }
        });
    }

}

export interface ChangePasswordType extends UserBodyType {
    newpassword: string;
}

export const userChangePassword = async (request: FastifyRequest<{ Body: ChangePasswordType }>, reply: FastifyReply) => {

    if (userMap.get("isLoggedIn")) {
        const collection = db.collection("users");

        const data = {
            username: isAdmin ? request.body.username : userMap.get("username"),
            password: bcrypt.hashSync(request.body.newpassword, 10)
        };

        await collection.updateOne({ username: isAdmin ? request.body.username : userMap.get("username") }, { $set: data }).then((result) => {
            if (result.modifiedCount === 1) {
                reply.send("Password changed.");
            } else {
                reply.send("User does not exist.");
            }
        });
    } else {
        reply.unauthorized("You need to be logged in to change your password.");
    }

}

export const createAdmin = async (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {

    const collection = db.collection("users");

    const data = {
        username: "admin",
        password: bcrypt.hashSync(request.body.password, 10)
    };

    if (await collection.findOne({ username: "admin" })) {
        reply.send("Admin already exists.");
    } else {    
        await collection.insertOne(data).then((result) => {
            if (result.insertedId !== undefined) {
                reply.send("Admin created.");
            } else {
                reply.send("An error occurred.");
            }
        });
    }

}

export interface ChangeUserNameType extends UserBodyType {
    newusername: string;
}

export const changeUsername = async (request: FastifyRequest<{ Body: ChangeUserNameType }>, reply: FastifyReply) => {

    if (userMap.get("isLoggedIn")) {
        const collection = db.collection("users");

        const data = {
            username: request.body.newusername,
            password: await collection.findOne({ username: isAdmin ? request.body.username : userMap.get("username") }).then((data) => data?.["password"])
        };

        if (await collection.findOne({ username: request.body.newusername })) {
            reply.send("Username already taken.");
        } else {
            await collection.updateOne({ username: isAdmin ? request.body.username : userMap.get("username") }, { $set: data }).then((result) => {
                if (result.modifiedCount === 1) {
                    reply.send("Username changed.");
                } else {
                    reply.send("User does not exist.");
                }
            });
        }
    } else {
        reply.unauthorized("You need to be logged in to change your username.");
    }

}