import { parse } from "yaml";
import fs from "fs";

interface Config {
    db: {
        username: string;
        password: string;
        url: {
            docker: string;
            local: string;
        }
    }
    app: {
        port: number;
        hcaptcha: {
            secret: string;
            sitekey: string;
        }
        webhook: string;
        state: {
            announcements: boolean;
            form: boolean;
			status: boolean;
        }
    }
}

const config: Config = parse(fs.readFileSync("./config/config.yml", "utf8"));

export default config;