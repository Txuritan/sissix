import path from "path";

import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { VitePWA as vitePWA } from "vite-plugin-pwa";
// import { viteSingleFile } from "vite-plugin-singlefile";

// import { visualizer } from "rollup-plugin-visualizer";

const production = !process.env.ROLLUP_WATCH;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        // viteSingleFile(),
        vitePWA({
            registerType: "autoUpdate",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
            },
            includeAssets: [
                "apple-touch-icon-114x114-precomposed.png",
                "apple-touch-icon-114x114.png",
                "apple-touch-icon-120x120-precomposed.png",
                "apple-touch-icon-120x120.png",
                "apple-touch-icon-144x144-precomposed.png",
                "apple-touch-icon-144x144.png",
                "apple-touch-icon-152x152-precomposed.png",
                "apple-touch-icon-152x152.png",
                "apple-touch-icon-180x180-precomposed.png",
                "apple-touch-icon-180x180.png",
                "apple-touch-icon-57x57-precomposed.png",
                "apple-touch-icon-57x57.png",
                "apple-touch-icon-60x60-precomposed.png",
                "apple-touch-icon-60x60.png",
                "apple-touch-icon-72x72-precomposed.png",
                "apple-touch-icon-72x72.png",
                "apple-touch-icon-76x76-precomposed.png",
                "apple-touch-icon-76x76.png",
                "apple-touch-icon-precomposed.png",
                "apple-touch-icon.png",
                "favicon-16x16.png",
                "favicon-194x194.png",
                "favicon-32x32.png",
                "favicon.ico",
                "mstile-144x144.png",
                "mstile-150x150.png",
                "mstile-310x150.png",
                "mstile-310x310.png",
                "mstile-70x70.png",
                "safari-pinned-tab.svg",
            ],
            manifest: {
                name: "Sissix",
                short_name: "Sissix",
                description: "A local-storage/indexed-db based book tracking web app.",
                theme_color: "#321919",
                background_color: "#321919",
                start_url: "./",
                scope: ".",
                display: "standalone",
                icons: [
                    {
                        "src": "/android-chrome-36x36.png",
                        "sizes": "36x36",
                        "type": "image/png"
                    },
                    {
                        "src": "/android-chrome-48x48.png",
                        "sizes": "48x48",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-72x72.png",
                        "sizes": "72x72",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-96x96.png",
                        "sizes": "96x96",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-144x144.png",
                        "sizes": "144x144",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-256x256.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-384x384.png",
                        "sizes": "384x384",
                        "type": "image/png"
                    },
                    {
                        "src": "android-chrome-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ]
            },
        }),
        // visualizer({
        //   emitFile: true,
        //   filename: "stats.html",
        // }),
    ],
    resolve: {
        alias: {
            "$lib": path.resolve(__dirname, "./src/lib"),
        },
    },
})
