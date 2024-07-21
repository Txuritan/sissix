import m from "../../libraries/mithril";
import { Fab } from "../../libraries/mithril-material-3/fab";
import { Add } from "../../libraries/mithril-material-3/icon/add";

import { getBookshelves } from "../../database/client";
import type { Bookshelf } from "../../models/database";
import { Err, type Result } from "../../utils";

import BookshelfEntry from "../../components/bookshelf";

export const Bookshelves: m.ClosureComponent = () => {
	let bookshelves: Result<Bookshelf[]> = Err(
		new Error("bookshelves didn't load"),
	);

	let fabOpen = false;

	const toggle = () => {
		fabOpen = !fabOpen;
	};

	return {
		oninit: async () => {
			bookshelves = await getBookshelves();
			m.redraw();
		},
		view: (vnode) => {
			return bookshelves.match({
				ok: (bookshelves) => {
					return m("div", { class: "bg-zinc-100 px-4" }, [
						m(Fab, { kind: "tertiary", icon: m(Add), onclick: toggle }, [
							fabOpen ? [
								m("div"),
							] : null,
						]),
						m("div", { class: "flex flex-col py-4 gap-y-2 md:gap-y-4" }, [
							bookshelves.map((bookshelf) => {
								return m(BookshelfEntry, { entry: bookshelf }, []);
							}),
						]),
					]);
				},
				err: (err) => {
					return null;
				},
			});
		},
	};
};
