import m from "../libraries/mithril";

import { Header } from "./header";
import { BookCover } from "./bookcover";

import { getBooks } from "../database/client";
import type { UserBook, Bookshelf } from "../models/database";
import { Err, from, type Result } from "../utils";

export interface BookshelfEntryProps {
	entry: Bookshelf;
}

export const BookshelfEntry: m.ClosureComponent<BookshelfEntryProps> = () => {
	let books: Result<UserBook[]> = Err(new Error("book cover didn't load"));

	return {
		oninit: async (vnode) => {
			const attrs = vnode.attrs;

			books = await getBooks(attrs.entry.id);
		},
		view: (vnode) => {
			const attrs = vnode.attrs;

			return books.match({
				ok: (books) => {
					return m("div", { key: from(attrs.entry.id) }, [
						m(Header, { title: attrs.entry.name }),
						m("div", { class: "flex flex-row gap-3.5 overflow-x-scroll" }, [
							books.map((book) => {
								return m(BookCover, { entry: book.book });
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

export default BookshelfEntry;
