import m from "../libraries/mithril";

import type { Book } from "../models/database";
import { from } from "../utils";

export interface BookCoverProps {
	entry: Book;
}

export const BookCover: m.ClosureComponent<BookCoverProps> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			return m(
				"div",
				{
					key: from(attrs.entry.id),
					class: "bg-surface-bright rounded h-64 w-36 flex content-center",
				},
				[
					m("img", {
						class: "aspect-[9/16] max-h-64 max-w-36 object-contain my-auto",
						src: attrs.entry.cover,
					}),
				],
			);
		},
	};
};

export default BookCover;
