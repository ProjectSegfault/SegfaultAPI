import config from "../../config.json";
import { verify } from "hcaptcha";
import { Webhook, MessageBuilder } from "discord-webhook-node";

const formApi = (app) => {
	if (config.state.form === false) {
		console.log("[SegfaultAPI] The form api is disabled.");
		app.get("/tools/form", async (req, res) => {
			res.send("The form api is disabled.");
		});
		app.get("/api/v1/state/form", async (req, res) => {
			res.json({ enabled: false });
		});
	} else {
		app.get("/tools/form", (req, res) => {
			res.sendFile("./public/tools/form.html", { root: "./" });
		});
		app.get("/api/v1/state/form", async (req, res) => {
			res.json({ enabled: true });
		});

		app.post("/api/v1/form", (req, res, config) => {
			handleForm(req, res);
		});
	}
};

const handleForm = (req, res) => {
	const ipAddress = req.socket.remoteAddress;

	verify(config.hcaptcha_secret, config.hcaptcha_sitekey)
		.then((data) => {
			const hook = new Webhook(config.webhook_url);
			if (data.success === true) {

                const embed = new MessageBuilder()
                .setAuthor(`${ipAddress}, ${req.body.email}, https://abuseipdb.com/check/${ipAddress}`)
                .addField('Comment type', req.body.commentType, true)
                .addField('Message', req.body.message)
                .setTimestamp();
                
				res.send(
					"Thanks for your message, and thanks for doing the captcha!\nPlease ignore how different this page looks to the page you were on earlier. I'll figure it out eventually!"
				);

				hook.send(embed);
			} else {
				res.send(
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
