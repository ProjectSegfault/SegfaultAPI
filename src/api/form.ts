import { verify } from "hcaptcha";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import log from "../utils/logUtil";
import getIp from "../utils/getIp";

const formApi = (fastify) => {
	if (process.env.FORM_STATE === "0") {
		log("The form api is disabled.", "warning");
		fastify.get("/tools/form", async (request, reply) => {
			reply.send("The form api is disabled.");
		});
		fastify.get("/api/v1/state/form", async (request, reply) => {
			reply.send({ enabled: false });
		});
	} else {
		fastify.get("/tools/form", (request, reply) => {
			reply.view("form", { title: "form implementation example" });
		});

		fastify.get("/api/v1/state/form", async (request, reply) => {
			reply.send({ enabled: true });
		});

		fastify.post("/api/v1/form", (request, reply) => {
			handleForm(request, reply);
		});
	}
};

const handleForm = (request, reply) => {
	const ip = getIp(request);

	verify(
		String(process.env.HCAPTCHA_SECRET),
		String(process.env.HCAPTCHA_SITEKEY)
	)
		.then((data) => {
			const hook = new Webhook(String(process.env.WEBHOOK_URL));
			if (data.success === true) {
				const embed = new MessageBuilder()
					.setAuthor(
						`${ip}, ${request.body.email}, https://abuseipdb.com/check/${ip}`
					)
					.addField("Comment type", request.body.commentType, true)
					.addField("Message", request.body.message)
					.setTimestamp();

				reply.send(
					"Thanks for your message, and thanks for doing the captcha!\nPlease ignore how different this page looks to the page you were on earlier. I'll figure it out eventually!"
				);

				hook.send(embed);
			} else {
				reply.send(
					"Seems like captcha failed, you didn't complete the captcha or you are a bot. Please try again.\nPlease note that your IP has been logged in our systems for manual review to check if you're an abusive user. If you're seen as abusive, you will be blacklisted.\nYour message has not been sent."
				);

				hook.send(
					`IP: ${ip}, https://abuseipdb.com/check/${ip}\nfailed to complete the captcha.`
				);
			}
		})
		.catch(console.error);
};

export default formApi;
