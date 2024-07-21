import m from "@/mithril";
import { Fab } from "@/mithril-material-3/fab";
import { Add } from "@/mithril-material-3/icon/add";

import Layout from "pages/layout";

export const Wishlist: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m(Layout, [
				m(Fab, { kind: "tertiary", icon: m(Add) }, []),
				m("h1", "Wishlist!"),
			]);
		},
	};
};
