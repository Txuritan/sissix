import m from "../libraries/mithril";
import { Fab } from "../libraries/mithril-material-3/fab";

import type { Bookshelf } from "../models/database";
import { Err, type Result } from "../utils";

import { Add } from "../components/base/icons";
import Button from "../components/base/button";
import BookshelfEntry from "../components/bookshelf";
import { getBookshelves } from "../database/client";
import { state } from "../shared/state";

export const LibraryBookshelves: m.ClosureComponent = () => {
	let bookshelves: Result<Bookshelf[]> = Err(
		new Error("bookshelves didn't load"),
	);

	return {
		oninit: async (_) => {
			bookshelves = await getBookshelves();
		},
		view: (vnode) => {
			if (!state.serviceWorker) {
				return null;
			}

			return bookshelves.match({
				ok: (bookshelves) => {
					return m("div", { class: "bg-zinc-100 px-4" }, [
						m(Fab, [
							m(Button, { kind: "primary", size: "large", type: "circle" }, [
								m(Add),
							]),
						]),
						m("div", { class: "flex flex-col py-4 gap-y-2 md:gap-y-4" }, [
							bookshelves.map((bookshelf) => {
								return m(BookshelfEntry, { entry: bookshelf }, []);
							}),
						]),
					]);
				},
				err: (_) => {
					return m("h1", "Error!");
				},
			});
		},
	};
};

export default LibraryBookshelves;
