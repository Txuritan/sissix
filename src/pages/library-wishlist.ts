import m from "../libraries/mithril";
import { Fab } from "../libraries/mithril-material-3/fab";

import { Add } from "../components/base/icons";
import Button from "../components/base/button";

export const LibraryWishlist: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return [
				m(Fab, [
					m(Button, { kind: "primary", size: "large", type: "circle" }, m(Add)),
				]),
				m("h1", "Wishlist!"),
			];
		},
	};
};

export default LibraryWishlist;
