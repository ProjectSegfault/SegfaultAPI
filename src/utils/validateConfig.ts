const validateConfig = () => {
    process.env.PORT === "0" ? console.error(`[SegfaultAPI] ❌ You need to set the port you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Port is set to ${process.env.PORT}.`);

    process.env.TOKEN === "YOUR_ANNOUNCEMENTS_TOKEN" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the authentication token you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Token is set to ${process.env.TOKEN}.`);

    process.env.HCAPTCHA_SECRET === "YOUR_HCAPTCHA_SECRET" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the hCaptcha secret you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ hCaptcha secret is set to ${process.env.HCAPTCHA_SECRET}.`);

    process.env.HCAPTCHA_SITEKEY === "YOUR_HCAPTCHA_SITEKEY" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the hCaptcha site key you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ hCaptcha site key is set to ${process.env.HCAPTCHA_SITEKEY}.`);

    process.env.WEBHOOK_URL === "YOUR_WEBHOOK_URL" || "" ? console.error(`[SegfaultAPI] ❌ You need to set the Discord webhook url you'd like to use in the config file.`) : console.log(`[SegfaultAPI] ✅ Discord webhook url is set to ${process.env.WEBHOOK_URL}.`);
}

export default validateConfig;