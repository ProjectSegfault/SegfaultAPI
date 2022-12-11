import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userMap, userSignup, userLogin, userDelete, userChangePassword, createAdmin, changeUsername } from "../utils/db";
import type { UserBodyType, ChangeUserNameType, ChangePasswordType } from "../utils/db";

const userApi = (fastify: FastifyInstance) => {
    fastify.get("/tools/user", (request: FastifyRequest, reply: FastifyReply) => {
        reply.view("user", {
            title: "user command centre",
            isAdmin: userMap.get("isAdmin"),
        });
    });

    fastify.post("/api/v1/user/signup", (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {
        userSignup(request, reply);
    });
    fastify.post("/api/v1/user/login", (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {
        userLogin(request, reply);
    });
    fastify.post("/api/v1/user/delete", (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {
        userDelete(request, reply);
    });
    fastify.post("/api/v1/user/changepassword", (request: FastifyRequest<{ Body: ChangePasswordType }>, reply: FastifyReply) => {
        userChangePassword(request, reply);
    });
    fastify.post("/api/v1/user/createadmin", (request: FastifyRequest<{ Body: UserBodyType }>, reply: FastifyReply) => {
        createAdmin(request, reply);
    });
    fastify.post("/api/v1/user/changeusername", (request: FastifyRequest<{ Body: ChangeUserNameType }>, reply: FastifyReply) => {
        changeUsername(request, reply);
    });
};

export default userApi;