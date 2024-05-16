import path from "path";

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from "vite-plugin-singlefile";

import { visualizer } from "rollup-plugin-visualizer";

const production = !process.env.ROLLUP_WATCH;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    viteSingleFile(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  resolve: {
    alias: {
      "$lib": path.resolve(__dirname, "./src/lib"),
    },
  },
})
