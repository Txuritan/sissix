import m from "../../libraries/mithril";
import { Fab } from "../../libraries/mithril-material-3/fab";
import { Add } from "../../libraries/mithril-material-3/icon/add";

export const Wishlist: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return [
				m(Fab, { kind: "tertiary", icon: m(Add) }, []),
				m("h1", "Wishlist!"),
			];
		},
	};
};
