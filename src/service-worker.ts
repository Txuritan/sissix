/// <reference lib="webworker" />

// biome-ignore lint/complexity/noUselessEmptyExport: THis is needed to get service worker types working, thanks Typescript.
export type {};
declare const self: ServiceWorkerGlobalScope;

import Path, { type TestMatch } from "./libraries/path";

import { getBookshelves, getBooks } from "./database/worker";
import { type Result, to } from "./utils";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Handler<T extends Record<string, any> = Record<string, any>> = (request: Request, params: TestMatch<T>) => Promise<Response>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Route<T extends Record<string, any> = Record<string, any>> = [
    Path<T>,
    Handler<T>,
];

const fetchHandler = (() => {
    const responseApi = <T>(data: T) => {
        return Response.json({ data: data }, { status: 200 });
    };

    const responseError = (status: number, code: string, message: string) => {
        return Response.json({ code: code, message: message }, { status: status });
    };

    const responseNotFound = (message: string) => responseError(404, "NOT_FOUND", message);

    const responseInternal = (message: string) => responseError(500, "INTERNAL_SERVER_ERROR", message);

    const intoResponse = <T>(result: Result<T>) => result.match({
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

        if (typeof(params.id) === "string") {
            if (request.method === "GET") {
                return intoResponse(await getBooks(to(params.id)));
            }
        }

        return responseNotFound("");
    };

    const handlers: Route[] = [
        [
            new Path("/api/bookshelves"),
            bookshelves,
        ],
        [
            new Path("/api/bookshelves/:id"),
            bookshelf,
        ],
    ];

    return async (request: Request): Promise<Response> => {
        const url = new URL(request.url);

        if (url.hostname === self.location.hostname) {
            for (const [path, handler] of handlers) {
                const parsed = path.test(url.pathname);
                if (parsed == null) {
                    continue;
                }

                return handler(request, parsed);
            }
        }

        return fetch(request);
    };
})();

self.addEventListener('activate', () => {
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(fetchHandler(event.request));
});

self.addEventListener("install", (_event) => {
    self.skipWaiting();
});

self.addEventListener("message", (_event) => {});
