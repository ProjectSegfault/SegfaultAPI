import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { db, initializeDb, closeDb } from "../utils/db";

export const userMap = new Map();

export const isAdmin = userMap.get("isAdmin");

interface BodyType {
	username: string;
	password: string;
}

interface ChangePasswordType extends BodyType {
	newpassword: string;
}

interface ChangeUserNameType extends BodyType {
	newusername: string;
}

const userApi = (fastify: FastifyInstance) => {
	fastify.get(
		"/tools/user",
		(request: FastifyRequest, reply: FastifyReply) => {
			reply.view("user", {
				title: "user command centre",
				isAdmin: userMap.get("isAdmin")
			});
		}
	);

	fastify.post(
		"/api/v1/user/signup",
		(request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			userSignup(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/login",
		(request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			userLogin(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/delete",
		(request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			userDelete(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/changepassword",
		(
			request: FastifyRequest<{ Body: ChangePasswordType }>,
			reply: FastifyReply
		) => {
			userChangePassword(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/createadmin",
		(request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
			createAdmin(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/changeusername",
		(
			request: FastifyRequest<{ Body: ChangeUserNameType }>,
			reply: FastifyReply
		) => {
			changeUsername(request, reply);
		}
	);
};

const userSignup = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isAdmin")) {
		const collection = db.collection("users");

		const data = {
			username: request.body.username,
			password: await bcrypt.hash(request.body.password, 10)
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

	closeDb();
};

const userLogin = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	const collection = db.collection("users");

	const data = await collection
		.find(
			{ username: request.body.username },
			{ projection: { _id: false } }
		)
		.toArray();

	if (data === undefined) {
		reply.send("User does not exist.");
	} else {
		bcrypt.compare(
			request.body.password,
			data[0]?.["password"],
			(err, result) => {
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
			}
		);
	}

	closeDb();
};

const userDelete = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("users");

		await collection
			.deleteOne({
				username: isAdmin
					? request.body.username
					: userMap.get("username")
			})
			.then((result) => {
				if (result.deletedCount === 1) {
					reply.send("User deleted.");
				} else {
					reply.send("User does not exist.");
				}
			});
	}

	closeDb();
};

const userChangePassword = async (
	request: FastifyRequest<{ Body: ChangePasswordType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("users");

		const data = {
			username: isAdmin ? request.body.username : userMap.get("username"),
			password: await bcrypt.hash(request.body.newpassword, 10)
		};

		await collection
			.updateOne(
				{
					username: isAdmin
						? request.body.username
						: userMap.get("username")
				},
				{ $set: data }
			)
			.then((result) => {
				if (result.modifiedCount === 1) {
					reply.send("Password changed.");
				} else {
					reply.send("User does not exist.");
				}
			});
	} else {
		reply.unauthorized("You need to be logged in to change your password.");
	}

	closeDb();
};

const createAdmin = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	initializeDb();

	const collection = db.collection("users");

	const data = {
		username: "admin",
		password: await bcrypt.hash(request.body.password, 10)
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

	closeDb();
};

const changeUsername = async (
	request: FastifyRequest<{ Body: ChangeUserNameType }>,
	reply: FastifyReply
) => {
	initializeDb();

	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("users");

		const data = {
			username: request.body.newusername,
			password: await collection
				.findOne({
					username: isAdmin
						? request.body.username
						: userMap.get("username")
				})
				.then((data) => data?.["password"])
		};

		if (await collection.findOne({ username: request.body.newusername })) {
			reply.send("Username already taken.");
		} else {
			await collection
				.updateOne(
					{
						username: isAdmin
							? request.body.username
							: userMap.get("username")
					},
					{ $set: data }
				)
				.then((result) => {
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

	closeDb();
};

export default userApi;
