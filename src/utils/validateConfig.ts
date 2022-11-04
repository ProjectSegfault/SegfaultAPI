import config from "../../config.json";

const validateConfig = () => {
    config.port === 0 ? console.error(`[SegfaultAPI] ❌ You need to set the port you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Port is set to ${config.port}.`);

    config.token === "YOUR_ANNOUNCEMENTS_TOKEN" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the authentication token you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Token is set to ${config.token}.`);

    config.hcaptcha_secret === "YOUR_HCAPTCHA_SECRET" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the hCaptcha secret you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ hCaptcha secret is set to ${config.hcaptcha_secret}.`);

    config.hcaptcha_sitekey === "YOUR_HCAPTCHA_SITEKEY" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the hCaptcha site key you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ hCaptcha site key is set to ${config.hcaptcha_sitekey}.`);

    config.webhook_url === "YOUR_WEBHOOK_URL" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the Discord webhook url you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Discord webhook url is set to ${config.webhook_url}.`);
}

export default validateConfig;