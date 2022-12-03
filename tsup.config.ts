import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	minify: true,
	format: "esm",
	clean: true,
	target: "node18"
});
