import { cpSync } from "fs";

cpSync("src/templates", "dist/templates", { recursive: true });
