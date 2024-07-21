import m from "@/mithril";
import * as Toast from "@/mithril-toast";

// import { Camera } from "^/camera";

import AddBulk from "./pages/add-bulk";
import AddScan from "./pages/add-scan";
import AddSearch from "./pages/add-search";
import { Bookshelf } from "./pages/bookshelf";
import { Bookshelves } from "./pages/bookshelves";
import { Tags } from "./pages/tags";
import { Wishlist } from "./pages/wishlist";
import { Settings } from "./pages/settings";

declare global {
	interface Sissix {
		gitHash: string | undefined;
		production: boolean | undefined;
	}

	const SISSIX: Sissix;
}

const registerServiceWorker = async () => {
	let registration: ServiceWorkerRegistration | undefined | null = null;
	let installingRegistration: ServiceWorker | undefined | null = null;

	const updateRegistration = (reg: ServiceWorkerRegistration) => {
		registration = reg;

		registration.addEventListener("updatefound", () => onUpdateFound());
	};

	const onUpdateFound = () => {
		if (installingRegistration) {
			installingRegistration.removeEventListener("statechange", onStateChange);
		}

		installingRegistration = registration?.installing;
		installingRegistration?.addEventListener("statechange", onStateChange);
	};

	const onStateChange = () => {
		if (installingRegistration && installingRegistration.state === "installed" && navigator.serviceWorker.controller) {
			installingRegistration = null;
			onUpdateReady();
		}
	};

	const onUpdateReady = () => {
		Toast.addInfo("ANd update is ready, please reload", 60 * 10 * 10);
	};

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).then(
			(registration) => updateRegistration(registration),
			(error) => console.error("Could not register service worker:", error),
		);
	}
};

window.addEventListener("load", () => {
	registerServiceWorker();

	if (!SISSIX.production) {
		new EventSource("/esbuild").addEventListener("change", () => location.reload());
	}

	m.route(document.body, "/bookshelves", {
		"/add/bulk": AddBulk,
		"/add/scan": AddScan,
		"/add/search": AddSearch,
		"/bookshelves": Bookshelves,
		"/bookshelves/:bookshelfId": Bookshelf,
		"/tags": Tags,
		"/wishlist": Wishlist,
		"/settings": Settings,
	});

	// TODO: have a setup screen where it walks the user though so they don't get a camera use popup the moment they open the app
	(async () => {
		// Camera.requestPermission();
	})();
});
