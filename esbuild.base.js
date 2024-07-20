import * as esbuild from "esbuild";

import { default as fsWithCallbacks } from "node:fs";
const fs = fsWithCallbacks.promises;

const getGitHash = async () => {
	const hash = await fs.readFile(".git/HEAD", "utf8");
	if (hash.indexOf(":") === -1) {
		return hash;
	}
	const refPath = `.git/${hash.substring(5).trim()}`;
	return await fs.readFile(refPath, "utf8");
};

const production = process.env.NODE_ENV === "production";

const rawHeader = "const SISSIX = { gitHash: GIT_HASH, production: PRODUCTION }";

const header = (
	await esbuild.transform(rawHeader, {
		define: {
			PRODUCTION: `${production}`,
			GIT_HASH: JSON.stringify((production) ? (await getGitHash()).trim() : "dev"),
		},
	})
).code;

export const config = {
	entryPoints: ["./src/main.ts", "./src/service-worker.ts"],
	sourcemap: true,
	bundle: true,
	banner: {
		js: header,
	},
	outdir: "./dist",
	target: ["es2020"],
};
