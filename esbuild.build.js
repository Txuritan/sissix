import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: [
        './src/main.ts',
        './src/service-worker.ts',
    ],
    sourcemap: true,
    bundle: true,
    minify: true,
    outdir: './dist',
    target: [
        "es2020"
    ],
});