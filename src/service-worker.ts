/// <reference lib="webworker" />

// biome-ignore lint/complexity/noUselessEmptyExport: THis is needed to get service worker types working, thanks Typescript.
export type {};
declare const self: ServiceWorkerGlobalScope;

import Path, { type TestMatch } from "./libraries/path";

import { getBookshelves, getBooks } from "./database/worker";
import { type Result, to } from "./utils";

const CACHE_NAME = `sissix-cache-${SISSIX.gitHash}`;

const fetchHandler = (() => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	type Handler<T extends Record<string, any> = Record<string, any>> = (
		request: Request,
		params: TestMatch<T>,
	) => Promise<Response>;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	type Route<T extends Record<string, any> = Record<string, any>> = [Path<T>, Handler<T>];

	const responseApi = <T>(data: T) => {
		return Response.json({ data: data }, { status: 200 });
	};

	const responseError = (status: number, code: string, message: string) => {
		return Response.json({ code: code, message: message }, { status: status });
	};

	const responseNotFound = (message: string) => responseError(404, "NOT_FOUND", message);

	const responseInternal = (message: string) => responseError(500, "INTERNAL_SERVER_ERROR", message);

	const intoResponse = <T>(result: Result<T>) =>
		result.match({
			ok: (value) => responseApi(value),
			err: (error) => responseInternal(error.message),
		});

	const bookshelves: Handler = async (request, _) => {
		if (request.method === "GET") {
			return intoResponse(await getBookshelves());
		}

		return responseNotFound("");
	};

	const bookshelf: Handler = async (request, params) => {
		if (params == null) {
			return responseNotFound("");
		}

		if (typeof params.id === "string") {
			if (request.method === "GET") {
				return intoResponse(await getBooks(to(params.id)));
			}
		}

		return responseNotFound("");
	};

	const handlers: Route[] = [
		[new Path("/api/bookshelves"), bookshelves],
		[new Path("/api/bookshelves/:id"), bookshelf],
	];

	return async (request: Request): Promise<Response> => {
		const url = new URL(request.url);

		if (url.hostname === self.location.hostname) {
			if (!SISSIX.production && url.pathname === "/esbuild") {
				return await fetch(request);
			}

			for (const [path, handler] of handlers) {
				const parsed = path.test(url.pathname);
				if (parsed == null) {
					continue;
				}

				return await handler(request, parsed);
			}
		}

		return await fetch(request);
	};
})();

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			const jobs = keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()));
			return Promise.all(jobs);
		})(),
	);

	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	event.respondWith(fetchHandler(event.request));
});

self.addEventListener("install", (event) => {
	const cachedPaths = [
		"./",
		"./android-chrome-144x144.png",
		"./android-chrome-192x192.png",
		"./android-chrome-256x256.png",
		"./android-chrome-36x36.png",
		"./android-chrome-384x384.png",
		"./android-chrome-48x48.png",
		"./android-chrome-512x512.png",
		"./android-chrome-72x72.png",
		"./android-chrome-96x96.png",
		"./apple-touch-icon-114x114-precomposed.png",
		"./apple-touch-icon-114x114.png",
		"./apple-touch-icon-120x120-precomposed.png",
		"./apple-touch-icon-120x120.png",
		"./apple-touch-icon-144x144-precomposed.png",
		"./apple-touch-icon-144x144.png",
		"./apple-touch-icon-152x152-precomposed.png",
		"./apple-touch-icon-152x152.png",
		"./apple-touch-icon-180x180-precomposed.png",
		"./apple-touch-icon-180x180.png",
		"./apple-touch-icon-57x57-precomposed.png",
		"./apple-touch-icon-57x57.png",
		"./apple-touch-icon-60x60-precomposed.png",
		"./apple-touch-icon-60x60.png",
		"./apple-touch-icon-72x72-precomposed.png",
		"./apple-touch-icon-72x72.png",
		"./apple-touch-icon-76x76-precomposed.png",
		"./apple-touch-icon-76x76.png",
		"./apple-touch-icon-precomposed.png",
		"./apple-touch-icon.png",
		"./favicon-16x16.png",
		"./favicon-194x194.png",
		"./favicon-32x32.png",
		"./favicon.ico",
		"./index.html",
		"./main.css",
		"./main.js",
		"./main.js.map",
		"./manifest.json",
		"./maskable-icon-1024x1024.png",
		"./maskable-icon-128x128.png",
		"./maskable-icon-192x192.png",
		"./maskable-icon-384x384.png",
		"./maskable-icon-48x48.png",
		"./maskable-icon-512x512.png",
		"./maskable-icon-72x72.png",
		"./maskable-icon-96x96.png",
		"./mstile-144x144.png",
		"./mstile-150x150.png",
		"./mstile-310x150.png",
		"./mstile-310x310.png",
		"./mstile-70x70.png",
		"./open-graph.png",
		"./robots.txt",
		"./safari-pinned-tab.svg",
		"./service-worker.js",
		"./service-worker.js.map",
	];

	self.skipWaiting();

	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(cachedPaths)));
});

self.addEventListener("message", (_event) => {});
