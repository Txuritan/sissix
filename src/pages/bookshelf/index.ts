import m from "@/mithril";
import { Button } from "@/mithril-material-3/button";
import { Fab } from "@/mithril-material-3/fab";
import { Add } from "@/mithril-material-3/icon/add";

export const Bookshelf: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return [
				m(Fab, { kind: "tertiary", icon: m(Add) }, [
					m(Button, { icon: m(Add) }, "Bulk Scan"),
					m(Button, { icon: m(Add) }, "Scan"),
					m(Button, { icon: m(Add) }, "Add"),
				]),
				m("h1", "Books!"),
			];
		},
	};
};