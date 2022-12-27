import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { db } from "../utils/db";
import Joi from "joi";

export const userMap = new Map();

export const isAdmin = userMap.get("isAdmin");

const userApi = (fastify: FastifyInstance) => {
	fastify.get(
		"/tools/user",
		(_request: FastifyRequest, reply: FastifyReply) => {
			const collection = db.collection("users");

			reply.view("user", {
				title: "user command centre",
				isAdmin: userMap.get("isAdmin"),
				isLoggedIn: userMap.get("isLoggedIn"),
				hasAdmin:
					collection.findOne({ username: "admin" }) !== null
						? true
						: false,
				isUser: true
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
		"/api/v1/user/logout",
		(request: FastifyRequest, reply: FastifyReply) => {
			userLogout(request, reply);
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
	fastify.post(
		"/api/v1/user/banip",
		(request: FastifyRequest<{ Body: BanIpType }>, reply: FastifyReply) => {
			banIp(request, reply);
		}
	);
	fastify.post(
		"/api/v1/user/unbanip",
		(
			request: FastifyRequest<{ Body: UnbanIpType }>,
			reply: FastifyReply
		) => {
			unbanIp(request, reply);
		}
	);
};

interface BodyType {
	username: string;
	password: string;
}

const BodyTypeSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required()
});

const userSignup = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isAdmin")) {
		if (BodyTypeSchema.validate(request.body).error) {
			reply.badRequest(`${BodyTypeSchema.validate(request.body).error}`);
		} else {
			const collection = db.collection("users");

			const data = {
				username: request.body.username,
				password: await bcrypt.hash(request.body.password, 10)
			};

			if (await collection.findOne({ username: request.body.username })) {
				reply.conflict("User already exists.");
			} else {
				await collection.insertOne(data).then((result) => {
					if (result.insertedId !== undefined) {
						reply.send("User created.");
					} else {
						reply.internalServerError(
							"An error occurred while writing to MongoDB."
						);
					}
				});
			}
		}
	} else {
		reply.unauthorized("You need to be an admin to create a user.");
	}
};

const userLogin = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	if (BodyTypeSchema.validate(request.body).error) {
		reply.badRequest(`${BodyTypeSchema.validate(request.body).error}`);
	} else {
		const collection = db.collection("users");

		const data = await collection
			.find(
				{ username: request.body.username },
				{ projection: { _id: false } }
			)
			.toArray();

		if (data === undefined) {
			reply.notFound("User not found.");
		} else {
			bcrypt.compare(
				request.body.password,
				data[0]?.["password"],
				(err, result) => {
					if (err) {
						reply.internalServerError(
							"An error occurred with bcrypt. " + err
						);
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
							reply.unauthorized("Incorrect password.");
						}
					}
				}
			);
		}
	}
};

const userLogout = async (_request: FastifyRequest, reply: FastifyReply) => {
	if (userMap.get("isLoggedIn")) {
		userMap.set("isLoggedIn", false);
		userMap.set("username", "");
		userMap.set("isAdmin", false);
		reply.send("User logged out.");
	} else {
		reply.unauthorized("You are not logged in.");
	}
};

const userDelete = async (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		if (BodyTypeSchema.validate(request.body).error) {
			reply.badRequest(`${BodyTypeSchema.validate(request.body).error}`);
		} else {
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
						reply.notFound("User does not exist.");
					}
				});
		}
	}
};

interface ChangePasswordType {
	username?: string;
	newpassword: string;
}

const ChangePasswordTypeSchema = Joi.object({
	username: isAdmin ? Joi.string().required() : Joi.forbidden(),
	newpassword: Joi.string().required()
});

const userChangePassword = async (
	request: FastifyRequest<{ Body: ChangePasswordType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		if (ChangePasswordTypeSchema.validate(request.body).error) {
			reply.badRequest(
				`${ChangePasswordTypeSchema.validate(request.body).error}`
			);
		} else {
			const collection = db.collection("users");

			const data = {
				username: isAdmin
					? request.body.username
					: userMap.get("username"),
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
						reply.notFound("User does not exist.");
					}
				});
		}
	} else {
		reply.unauthorized("You need to be logged in to change your password.");
	}
};

interface CreateAdminType {
	password: string;
}

const CreateAdminTypeSchema = Joi.object({
	password: Joi.string().required()
});

const createAdmin = async (
	request: FastifyRequest<{ Body: CreateAdminType }>,
	reply: FastifyReply
) => {
	if (CreateAdminTypeSchema.validate(request.body).error) {
		reply.badRequest(
			`${CreateAdminTypeSchema.validate(request.body).error}`
		);
	} else {
		const collection = db.collection("users");

		const data = {
			username: "admin",
			password: await bcrypt.hash(request.body.password, 10)
		};

		if (await collection.findOne({ username: "admin" })) {
			reply.conflict("Admin already exists.");
		} else {
			await collection.insertOne(data).then((result) => {
				if (result.insertedId !== undefined) {
					reply.send("Admin created.");
				} else {
					reply.internalServerError(
						"An error occurred while writing to MongoDB."
					);
				}
			});
		}
	}
};

interface ChangeUserNameType {
	username?: string;
	newusername: string;
}

const ChangeUserNameTypeSchema = Joi.object({
	username: isAdmin ? Joi.string().required() : Joi.forbidden(),
	newusername: Joi.string().required()
});

const changeUsername = async (
	request: FastifyRequest<{ Body: ChangeUserNameType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		if (ChangeUserNameTypeSchema.validate(request.body).error) {
			reply.badRequest(
				`${ChangeUserNameTypeSchema.validate(request.body).error}`
			);
		} else {
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

			if (
				await collection.findOne({ username: request.body.newusername })
			) {
				reply.conflict("Username already taken.");
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
							reply.notFound("User does not exist.");
						}
					});
			}
		}
	} else {
		reply.unauthorized("You need to be logged in to change your username.");
	}
};

interface BanIpType {
	ip: string;
	reason: string;
	bannedBy: string;
}

const BanIpTypeSchema = Joi.object({
	ip: Joi.string().ip().required(),
	reason: Joi.string().required(),
	bannedBy: Joi.string().required()
});

const banIp = async (
	request: FastifyRequest<{ Body: BanIpType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isAdmin")) {
		if (BanIpTypeSchema.validate(request.body).error) {
			reply.badRequest(`${BanIpTypeSchema.validate(request.body).error}`);
		} else {
			const collection = db.collection("banned");

			if (await collection.findOne({ ip: request.body.ip })) {
				reply.conflict("IP already banned.");
			} else {
				await collection
					.insertOne({
						...request.body,
						time: Math.floor(Date.now() / 1000)
					})
					.then((result) => {
						if (result.insertedId !== undefined) {
							reply.send("IP banned.");
						} else {
							reply.internalServerError(
								"An error occurred while writing to MongoDB."
							);
						}
					});
			}
		}
	} else {
		reply.unauthorized("You need to be an admin to ban IPs.");
	}
};

interface UnbanIpType {
	ip: string;
	reason: string;
	unbannedBy: string;
}

const UnbanIpTypeSchema = Joi.object({
	ip: Joi.string().ip().required(),
	reason: Joi.string().required(),
	unbannedBy: Joi.string().required()
});

const unbanIp = async (
	request: FastifyRequest<{ Body: UnbanIpType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isAdmin")) {
		if (UnbanIpTypeSchema.validate(request.body).error) {
			reply.badRequest(
				`${UnbanIpTypeSchema.validate(request.body).error}`
			);
		} else {
			const collection = db.collection("banned");

			const unbannedCollection = db.collection("unbanned");

			await collection
				.deleteOne({ ip: request.body.ip })
				.then(async (result) => {
					if (result.deletedCount === 1) {
						await unbannedCollection
							.insertOne({
								...request.body,
								time: Math.floor(Date.now() / 1000)
							})
							.then((result) => {
								if (result.insertedId !== undefined) {
									reply.send("IP unbanned.");
								} else {
									reply.internalServerError(
										"An error occurred while writing to MongoDB."
									);
								}
							});
					} else {
						reply.notFound("IP is not banned.");
					}
				});
		}
	} else {
		reply.unauthorized("You need to be an admin to ban IPs.");
	}
};

export default userApi;
