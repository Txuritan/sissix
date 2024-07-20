import * as esbuild from "esbuild";
import { config } from "./esbuild.base.js";

const ctx = await esbuild.context(config);

await ctx.watch();

const { host, port } = await ctx.serve({
	servedir: "./dist",
});

console.log(`Started on http://${host}:${port}`);
