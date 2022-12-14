import { build } from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
	absWorkingDir: join(__dirname, ".."),
	bundle: true,
	minify: true,
	format: "esm",
	entryPoints: ["src/index.ts"],
	platform: "node",
	outfile: "src/main.js",
	packages: "external"
});
