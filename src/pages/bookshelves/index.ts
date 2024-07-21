import m from "@/mithril";
import { Button } from "@/mithril-material-3/button";
import { Fab } from "@/mithril-material-3/fab";
import { Add } from "@/mithril-material-3/icon/add";

import { getBookshelves } from "../../database/client";
import type { Bookshelf } from "../../models/database";
import { Err, type Result } from "../../utils";

import BookshelfEntry from "../../components/bookshelf";

import Layout from "pages/layout";

export const Bookshelves: m.ClosureComponent = () => {
	let bookshelves: Result<Bookshelf[]> = Err(new Error("bookshelves didn't load"));

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
			return bookshelves
				.map((bookshelves) => {
					const fabButtons = [
						m("div", { class: "absolute right-6 bottom-40 flex flex-col gap-2" }, [
							m(Button, { size: "small", icon: m(Add) }, "Bulk Scan"),
							m(Button, { size: "small", icon: m(Add) }, "Scan"),
							m(Button, { size: "small", icon: m(Add) }, "Add"),
						]),
					];

					const fab = m(Fab, { kind: "tertiary", icon: m(Add), onclick: toggle }, [fabOpen ? fabButtons : null]);

					return m(Layout, [
						m("div", { class: "bg-zinc-100 px-4" }, [
							fab,
							m("div", { class: "flex flex-col py-4 gap-y-2 md:gap-y-4" }, [
								bookshelves.map((bookshelf) => {
									return m(BookshelfEntry, { entry: bookshelf }, []);
								}),
							]),
						]),
					]);
				})
				.unwrapOr(null);
		},
	};
};
