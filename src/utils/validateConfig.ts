import log from "./logUtil";

const validateConfig = () => {
	if (process.env.PORT !== "0") {
		log(`Port is set to ${process.env.PORT}.`);
	} else {
		log(
			"You need to set the port you'd like to use in the config file.",
			"error"
		);
	}

	if (process.env.TOKEN !== "YOUR_ANNOUNCEMENTS_TOKEN" || "") {
		log(`Token is set to ${process.env.TOKEN}.`);
	} else {
		log(
			`You need to set the authentication token you'd like to use in the config file.`,
			"error"
		);
	}

	if (process.env.HCAPTCHA_SECRET !== "YOUR_HCAPTCHA_SECRET" || "") {
		log(`hCaptcha secret is set to ${process.env.HCAPTCHA_SECRET}.`);
	} else {
		log(
			`You need to set the hCaptcha secret you'd like to use in the config file.`,
			"error"
		);
	}

	if (process.env.HCAPTCHA_SITEKEY !== "YOUR_HCAPTCHA_SITEKEY" || "") {
		log(`hCaptcha site key is set to ${process.env.HCAPTCHA_SITEKEY}.`);
	} else {
		log(
			`You need to set the hCaptcha site key you'd like to use in the config file.`,
			"error"
		);
	}

	if (process.env.WEBHOOK_URL !== "YOUR_WEBHOOK_URL" || "") {
		log(`Discord webhook url is set to ${process.env.WEBHOOK_URL}.`);
	} else {
		log(
			`You need to set the Discord webhook url you'd like to use in the config file.`,
			"error"
		);
	}

	if (process.env.ANNOUNCEMENTS_STATE === "0" || "1") {
		log(
			`Announcements state is set to ${process.env.ANNOUNCEMENTS_STATE}.`
		);
	} else {
		log(
			`You need to set the announcements state in the config file.`,
			"error"
		);
	}

	if (process.env.FORM_STATE === "0" || "1") {
		log(`Form state is set to ${process.env.FORM_STATE}.`);
	} else {
		log(`You need to set the form state in the config file.`, "error");
	}
};

export default validateConfig;
