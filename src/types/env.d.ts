declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            TOKEN: string;
            HCAPTCHA_SECRET: string;
            HCAPTCHA_SITEKEY: string;
            WEBHOOK_URL: string;
            ANNOUNCEMENTS_STATE: "0" | "1";
            FORM_STATE: "0" | "1";
            NODE_ENV: "development" | "production";
        }
    }
}

export {};