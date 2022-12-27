import { verify } from "hcaptcha";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import log from "../utils/logUtil";
import getIp from "../utils/getIp";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import config from "../utils/config";
import Joi from "joi";

const formApi = (fastify: FastifyInstance) => {
	if (!config.app.state.form) {
		log("The form api is disabled.", "warning");
		fastify.get(
			"/tools/form",
			async (_request: FastifyRequest, reply: FastifyReply) => {
				reply.send("The form api is disabled.");
			}
		);
		fastify.get(
			"/api/v1/state/form",
			async (_request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: false });
			}
		);
	} else {
		fastify.get(
			"/tools/form",
			(_request: FastifyRequest, reply: FastifyReply) => {
				reply.view("form", {
					title: "form implementation example",
					sitekey: config.app.hcaptcha.sitekey
				});
			}
		);

		fastify.get(
			"/api/v1/state/form",
			async (_request: FastifyRequest, reply: FastifyReply) => {
				reply.send({ enabled: true });
			}
		);

		fastify.post(
			"/api/v1/form",
			(
				request: FastifyRequest<{ Body: BodyType }>,
				reply: FastifyReply
			) => {
				handleForm(request, reply);
			}
		);
	}
};

interface BodyType {
	email: string;
	commentType: string;
	message: string;
	"h-captcha-response": string;
	"g-recaptcha-response"?: string;
}

const BodyTypeSchema = Joi.object({
	email: Joi.string().email().required(),
	commentType: Joi.string().required(),
	message: Joi.string().required(),
	"h-captcha-response": Joi.string().required(),
	"g-recaptcha-response": Joi.string().optional().allow("")
});

const handleForm = (
	request: FastifyRequest<{ Body: BodyType }>,
	reply: FastifyReply
) => {
	if (BodyTypeSchema.validate(request.body).error) {
		reply.badRequest(`${BodyTypeSchema.validate(request.body).error}`);
	} else {
		const ip = getIp(request);

		verify(
			config.app.hcaptcha.secret,
			request.body["h-captcha-response"]
		).then((data) => {
			const hook = new Webhook(config.app.webhook);
			if (data.success) {
				const embed = new MessageBuilder()
					.setAuthor(
						`${ip}, ${request.body.email}, https://abuseipdb.com/check/${ip}`
					)
					.addField("Comment type", request.body.commentType, true)
					.addField("Message", request.body.message)
					.setTimestamp();

				reply.send(
					"Thanks for your message, we will get back to you as soon as possible."
				);

				hook.send(embed);
			} else {
				reply.unauthorized(
					"Captcha failed or expired, please try again. If this keeps happening, assume the captcha is broken and contact us on Matrix." +
						" Error: " +
						data["error-codes"]
				);

				hook.send(
					`IP: ${ip}, https://abuseipdb.com/check/${ip}\nfailed to complete the captcha with error: ${data["error-codes"]}.`
				);
			}
		});
	}
};

export default formApi;
