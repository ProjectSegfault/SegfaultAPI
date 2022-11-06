const validateConfig = () => {
	if (process.env.PORT !== "0") {
		console.log(`[SegfaultAPI] ✅ Port is set to ${process.env.PORT}.`);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the port you'd like to use in the config file.`
		);
	}

	if (process.env.TOKEN !== "YOUR_ANNOUNCEMENTS_TOKEN" || "") {
		console.log(`[SegfaultAPI] ✅ Token is set to ${process.env.TOKEN}.`);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the authentication token you'd like to use in the config file.`
		);
	}

	if (process.env.HCAPTCHA_SECRET !== "YOUR_HCAPTCHA_SECRET" || "") {
		console.log(
			`[SegfaultAPI] ✅ hCaptcha secret is set to ${process.env.HCAPTCHA_SECRET}.`
		);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the hCaptcha secret you'd like to use in the config file.`
		);
	}

	if (process.env.HCAPTCHA_SITEKEY !== "YOUR_HCAPTCHA_SITEKEY" || "") {
		console.log(
			`[SegfaultAPI] ✅ hCaptcha site key is set to ${process.env.HCAPTCHA_SITEKEY}.`
		);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the hCaptcha site key you'd like to use in the config file.`
		);
	}

	if (process.env.WEBHOOK_URL !== "YOUR_WEBHOOK_URL" || "") {
		console.log(
			`[SegfaultAPI] ✅ Discord webhook url is set to ${process.env.WEBHOOK_URL}.`
		);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the Discord webhook url you'd like to use in the config file.`
		);
	}

	if (process.env.ANNOUNCEMENTS_STATE === "0" || "1") {
		console.log(
			`[SegfaultAPI] ✅ Announcements state is set to ${process.env.ANNOUNCEMENTS_STATE}.`
		);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the announcements state in the config file.`
		);
	}

	if (process.env.FORM_STATE === "0" || "1") {
		console.log(
			`[SegfaultAPI] ✅ Form state is set to ${process.env.FORM_STATE}.`
		);
	} else {
		console.error(
			`[SegfaultAPI] ❌ You need to set the form state in the config file.`
		);
	}
};

export default validateConfig;
