import m from "./libraries/mithril";
import * as Toast from "./libraries/mithril-toast";

import AddBulk from "./pages/add-bulk";
import AddScan from "./pages/add-scan";
import AddSearch from "./pages/add-search";
import LibraryBookshelf from "./pages/library-bookshelf";
import LibraryBookshelves from "./pages/library-bookshelves";
import LibraryTags from "./pages/library-tags";
import LibraryWishlist from "./pages/library-wishlist";
import Settings from "./pages/settings";

import Layout from "./shared/layout";
import { state } from "./shared/state";

const wrapper = (comp: m.ClosureComponent): m.RouteResolver => {
	return {
		render: () => {
			return m(Layout, m(comp));
		},
	};
};

const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				"./service-worker.js",
			);
			if (registration.waiting && registration.active) {
				Toast.addInfo("Please reload the tab to get updates.");
			} else if (registration.active) {
				state.serviceWorker = true;
			} else {
				registration.addEventListener("updatefound", () => {
					if (registration.installing == null) {
						return;
					}

					registration.installing.addEventListener("statechange", (event) => {
						if (event.target == null) {
							return;
						}

						const worker = event.target as ServiceWorker;
						if (worker.state === "installed") {
							if (registration.active) {
								Toast.addInfo("Please reload the tab to get updates.");
							} else {
								state.serviceWorker = true;
							}
						}
					});
				});
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};

window.addEventListener("load", () => {
	registerServiceWorker();

	new EventSource("/esbuild").addEventListener("change", () =>
		location.reload(),
	);

	m.route(document.body, "/library/bookshelves", {
		"/add/bulk": AddBulk,
		"/add/scan": AddScan,
		"/add/search": AddSearch,
		"/library/bookshelves": wrapper(LibraryBookshelves),
		"/library/bookshelves/:bookshelfId": wrapper(LibraryBookshelf),
		"/library/tags": wrapper(LibraryTags),
		"/library/wishlist": wrapper(LibraryWishlist),
		"/settings": wrapper(Settings),
	});
});
