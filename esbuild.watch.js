import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
    entryPoints: [
        './src/main.ts',
        './src/service-worker.ts',
    ],
    sourcemap: true,
    bundle: true,
    outdir: './dist',
    target: [
        "es2020"
    ],
});

await ctx.watch();

let { host, port } = await ctx.serve({
    servedir: './dist',
});

console.log("Started on http://"+host+":"+port);
