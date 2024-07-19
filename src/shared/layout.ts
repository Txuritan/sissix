import m from "../libraries/mithril";
import * as Toast from "../libraries/mithril-toast";

import { Nav } from "../libraries/mithril-material-3/nav";
import { Label } from "../libraries/mithril-material-3/icon/label";
import { Shelves } from "../libraries/mithril-material-3/icon/shelves";
import { ShoppingMode } from "../libraries/mithril-material-3/icon/shopping-mode";
import { Settings } from "../libraries/mithril-material-3/icon/settings";

export const Layout: m.ClosureComponent = (_vnode) => {
	return {
		view: (vnode) => {
			const items = [
				{
					href: "/library/bookshelves",
					icon: Shelves,
					label: "Bookshelves",
				},
				{
					href: "/library/tags",
					icon: Label,
					label: "Tags",
				},
				{
					href: "/library/wishlist",
					icon: ShoppingMode,
					label: "Wishlist",
				},
				{
					href: "/settings",
					icon: Settings,
					label: "Settings",
				},
			];

			return m.fragment({}, [
				m(Toast.Drawer),
				m("div", { class: "flex-1 overflow-y-scroll" }, vnode.children),
				m(Nav, { items: items }, []),
			]);
		},
	};
};

export default Layout;
