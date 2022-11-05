import config from "../../config.json";
import { verify } from "hcaptcha";
import { Webhook, MessageBuilder } from "discord-webhook-node";

const formApi = (fastify) => {
	if (config.state.form === false) {
		console.log("[SegfaultAPI] The form api is disabled.");
		fastify.get("/tools/form", async (request, reply) => {
			reply.send("The form api is disabled.");
		});
		fastify.get("/api/v1/state/form", async (request, reply) => {
			reply.send({ enabled: false });
		});
	} else {
		fastify.get("/tools/form", (request, reply) => {
			reply.sendFile("./public/tools/form.html", { root: "./" });
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
	const ipAddress = request.socket.remoteAddress;

	verify(config.hcaptcha_secret, config.hcaptcha_sitekey)
		.then((data) => {
			const hook = new Webhook(config.webhook_url);
			if (data.success === true) {

                const embed = new MessageBuilder()
                .setAuthor(`${ipAddress}, ${request.body.email}, https://abuseipdb.com/check/${ipAddress}`)
                .addField('Comment type', request.body.commentType, true)
                .addField('Message', request.body.message)
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
					`IP: ${ipAddress}, https://abuseipdb.com/check/${ipAddress}\nfailed to complete the captcha.`
				);
			}
		})
		.catch(console.error);
};

export default formApi;
