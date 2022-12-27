import { build } from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { copy } from "esbuild-plugin-copy";
import { clean } from "esbuild-plugin-clean";

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
	absWorkingDir: join(__dirname, ".."),
	bundle: true,
	minify: true,
	format: "esm",
	entryPoints: ["src/index.ts"],
	platform: "node",
	outdir: "dist",
	packages: "external",
	plugins: [
		copy({
			resolveFrom: join(__dirname, ".."),
			assets: [
				{
					from: ["src/templates/**/*"],
					to: ["dist/templates"]
				}
			]
		}),
		clean({
			patterns: ["dist"]
		})
	]
});
