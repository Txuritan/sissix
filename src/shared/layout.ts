import m from "@/mithril";
import * as Toast from "@/mithril-toast";

import { Nav } from "@/mithril-material-3/nav";
import { Label } from "@/mithril-material-3/icon/label";
import { Shelves } from "@/mithril-material-3/icon/shelves";
import { ShoppingMode } from "@/mithril-material-3/icon/shopping-mode";
import { Settings } from "@/mithril-material-3/icon/settings";

export const Layout: m.ClosureComponent = (_vnode) => {
	return {
		view: (vnode) => {
			const items = [
				{
					href: "bookshelves",
					icon: Shelves,
					label: "Bookshelves",
				},
				{
					href: "tags",
					icon: Label,
					label: "Tags",
				},
				{
					href: "wishlist",
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
