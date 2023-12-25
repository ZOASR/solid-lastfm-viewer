import path from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
	plugins: [solid(), dts(), libInjectCss()],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "index.ts"),
			name: "solid-lastfm-viewer",
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ["solid-js"],
			output: {
				globals: {
					solid: "solid-js",
				},
			},
		},
		sourcemap: true,
		emptyOutDir: true,
	},
});
