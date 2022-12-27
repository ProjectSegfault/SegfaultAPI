import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import log from "../utils/logUtil";
import { db } from "../utils/db";
import { userMap } from "./user";
import config from "../utils/config";
import Joi from "joi";

const blogApi = (fastify: FastifyInstance) => {
	if (!config.app.state.blog) {
		log("The blog api is disabled.", "warning");
		fastify.get(
			"/tools/blog",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The blog api is disabled.");
			}
		);

		fastify.get(
			"/api/v1/state/blog",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: false });
			}
		);

		fastify.get(
			"/api/v1/blog",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The blog api is disabled.");
			}
		);

		fastify.get(
			"/api/v1/blog/*",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The blog api is disabled.");
			}
		);
	} else {
		fastify.get(
			"/tools/blog",
			async (_request: FastifyRequest, reply: FastifyReply) => {
				const collection = db.collection("blog");

				const postTitles = new Promise((resolve, reject) => {
					collection
						.find({})
						.toArray()
						.then((docs) => {
							const titles = docs.map((doc) => doc["title"]);
							resolve(titles);
						})
						.catch((err) => reject(err));
				});

				return await reply.view("blog", {
					title: "blog command centre",
					isLoggedIn: userMap.get("isLoggedIn"),
					postTitles: await postTitles
				});
			}
		);

		fastify.get(
			"/api/v1/state/blog",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: true });
			}
		);

		fastify.get(
			"/api/v1/blog",
			(request: FastifyRequest, reply: FastifyReply) => {
				getPosts(request, reply);
			}
		);
		fastify.post(
			"/api/v1/blog/add",
			(
				request: FastifyRequest<{ Body: AddPostType }>,
				reply: FastifyReply
			) => {
				addPost(request, reply);
			}
		);
		fastify.post(
			"/api/v1/blog/delete",
			(
				request: FastifyRequest<{ Body: DeletePostType }>,
				reply: FastifyReply
			) => {
				deletePost(request, reply);
			}
		);
		fastify.post(
			"/api/v1/blog/edit",
			(
				request: FastifyRequest<{ Body: EditPostType }>,
				reply: FastifyReply
			) => {
				editPost(request, reply);
			}
		);
		fastify.get(
			"/api/v1/blog/tags",
			(request: FastifyRequest, reply: FastifyReply) => {
				getTags(request, reply);
			}
		);
		fastify.get(
			"/api/v1/blog/tags/:tag",
			(
				request: FastifyRequest<{ Params: GetPostsByTagType }>,
				reply: FastifyReply
			) => {
				getPostsByTag(request, reply);
			}
		);
		fastify.get(
			"/api/v1/blog/authors",
			(request: FastifyRequest, reply: FastifyReply) => {
				getAuthors(request, reply);
			}
		);
		fastify.get(
			"/api/v1/blog/authors/:author",
			(
				request: FastifyRequest<{ Params: GetPostsByAuthorType }>,
				reply: FastifyReply
			) => {
				getPostsByAuthor(request, reply);
			}
		);
		fastify.get(
			"/api/v1/blog/:title",
			(
				request: FastifyRequest<{ Params: GetPostsByTitleType }>,
				reply: FastifyReply
			) => {
				getPostsByTitle(request, reply);
			}
		);
	}
};

interface AddPostType {
	title: string;
	content: string;
	tags?: string;
	author: string;
}

const AddPostTypeSchema = Joi.object({
	title: Joi.string().required(),
	content: Joi.string().required(),
	tags: Joi.string().optional().allow(""),
	author: Joi.string().required()
});

const addPost = async (
	request: FastifyRequest<{ Body: AddPostType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		if (AddPostTypeSchema.validate(request.body).error) {
			reply.badRequest(
				`${AddPostTypeSchema.validate(request.body).error}`
			);
		} else {
			const collection = db.collection("blog");

			const now = Math.floor(Date.now() / 1000);
			const data = {
				title: request.body.title,
				content: request.body.content,
				tags: request.body.tags ? request.body.tags.split(" ") : [],
				author: request.body.author,
				created: now,
				words: request.body.content.trim().split(/\s+/).length,
				readingTime: Math.ceil(
					request.body.content.trim().split(/\s+/).length / 225
				)
			};

			if (await collection.findOne({ title: request.body.title })) {
				reply.conflict("Title already exists.");
			} else {
				await collection.insertOne(data);

				reply.send(
					"Your post has been posted." + JSON.stringify(request.body)
				);
			}
		}
	} else {
		reply.unauthorized("You need to log in in order to post a post.");
	}
};

interface DeletePostType {
	title: string;
}

const deletePost = async (
	request: FastifyRequest<{ Body: DeletePostType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		const collection = db.collection("blog");

		await collection
			.deleteOne({ title: request.body.title })
			.then((data) => {
				if (data.deletedCount === 0) {
					reply.notFound("Post not found.");
				} else {
					reply.send("Post deleted.");
				}
			});
	} else {
		reply.unauthorized("You need to log in in order to delete a post.");
	}
};

interface EditPostType {
	title: string;
	newTitle?: string;
	content?: string;
	tags?: string;
	area: "title" | "content" | "tags";
}

const EditPostTypeSchema = Joi.object({
	title: Joi.string().required(),
	newTitle: Joi.string().optional().allow(""),
	content: Joi.string().optional().allow(""),
	tags: Joi.string().optional().allow(""),
	area: Joi.string().required().allow("title", "content", "tags")
});

const editPost = async (
	request: FastifyRequest<{ Body: EditPostType }>,
	reply: FastifyReply
) => {
	if (userMap.get("isLoggedIn")) {
		if (EditPostTypeSchema.validate(request.body).error) {
			reply.badRequest(
				`${EditPostTypeSchema.validate(request.body).error}`
			);
		} else {
			if (request.body.area === "title") {
				const collection = db.collection("blog");

				await collection
					.updateOne(
						{ title: request.body.title },
						{ $set: { title: request.body.newTitle } }
					)
					.then((data) => {
						if (data.modifiedCount === 0) {
							reply.notFound(
								"Post not found." + JSON.stringify(request.body)
							);
						} else {
							reply.send("Post edited.");
						}
					});
			} else if (request.body.area === "content") {
				const collection = db.collection("blog");

				const now = Math.floor(Date.now() / 1000);

				await collection
					.updateOne(
						{ title: request.body.title },
						{
							$set: {
								content: request.body.content,
								updated: now,
								words: request.body.content!.trim().split(/\s+/)
									.length
							}
						}
					)
					.then((data) => {
						if (data.modifiedCount === 0) {
							reply.notFound("Post not found.");
						} else {
							reply.send("Post edited.");
						}
					});
			} else if (request.body.area === "tags") {
				const collection = db.collection("blog");

				await collection
					.updateOne(
						{ title: request.body.title },
						{
							$set: {
								tags: request.body.tags
									? request.body.tags.split(" ")
									: []
							}
						}
					)
					.then((data) => {
						if (data.modifiedCount === 0) {
							reply.notFound("Post not found.");
						} else {
							reply.send("Post edited.");
						}
					});
			}
		}
	} else {
		reply.unauthorized("You need to log in in order to edit a post.");
	}
};

const getPosts = async (_request: FastifyRequest, reply: FastifyReply) => {
	const collection = db.collection("blog");

	await collection
		.find({}, { projection: { _id: false } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts.");
			} else {
				reply.send(data.sort((a, b) => b["created"] - a["created"]));
			}
		});
};

interface GetPostsByTagType {
	tag: string;
}

const getPostsByTag = async (
	request: FastifyRequest<{ Params: GetPostsByTagType }>,
	reply: FastifyReply
) => {
	const collection = db.collection("blog");

	await collection
		.find({ tags: request.params.tag }, { projection: { _id: false } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts with that tag.");
			} else {
				reply.send(data);
			}
		});
};

interface GetPostsByAuthorType {
	author: string;
}

const getPostsByAuthor = async (
	request: FastifyRequest<{ Params: GetPostsByAuthorType }>,
	reply: FastifyReply
) => {
	const collection = db.collection("blog");

	await collection
		.find({ author: request.params.author }, { projection: { _id: false } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts with that author.");
			} else {
				reply.send(data);
			}
		});
};

interface GetPostsByTitleType {
	title: string;
}

const getPostsByTitle = async (
	request: FastifyRequest<{ Params: GetPostsByTitleType }>,
	reply: FastifyReply
) => {
	const collection = db.collection("blog");

	await collection
		.find({ title: request.params.title }, { projection: { _id: false } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts with that title.");
			} else {
				reply.send(data[0]);
			}
		});
};

const getTags = async (_request: FastifyRequest, reply: FastifyReply) => {
	const collection = db.collection("blog");

	await collection
		.find({}, { projection: { _id: false, tags: true } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts.");
			} else {
				const tags = data.map((post) => post["tags"]).flat();
				const uniqueTags = [...new Set(tags)];
				reply.send(uniqueTags);
			}
		});
};

const getAuthors = async (_request: FastifyRequest, reply: FastifyReply) => {
	const collection = db.collection("blog");

	await collection
		.find({}, { projection: { _id: false, author: true } })
		.toArray()
		.then((data) => {
			if (data.length === 0 || data[0] === undefined) {
				reply.notFound("There are no blog posts.");
			} else {
				const authors = data.map((post) => post["author"]);
				const uniqueAuthors = [...new Set(authors)];
				reply.send(uniqueAuthors);
			}
		});
};

export default blogApi;
