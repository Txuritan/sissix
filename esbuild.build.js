import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: [
        './src/main.ts',
        './src/service-worker.ts',
    ],
    define: {
        PRODUCTION: `${process.env.NODE_ENV === "production"}`,
    },
    sourcemap: true,
    bundle: true,
    minify: true,
    outdir: './dist',
    target: [
        "es2020"
    ],
});