import * as esbuild from "esbuild";
import { config } from "./esbuild.base.js";

await esbuild.build({ ...config, minify: true });
