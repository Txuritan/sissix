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
			const create = (href: string, icon: m.ClosureComponent, label: string) => ({
				href: href,
				icon: icon,
				label: label,
			});

			const items = [
				create("/bookshelves", Shelves, "Bookshelves"),
				create("/tags", Label, "Tags"),
				create("/wishlist", ShoppingMode, "Wishlist"),
				create("/settings", Settings, "Settings"),
			];

			return [
				m(Toast.Drawer),
				m("div", { class: "flex-1 overflow-y-scroll" }, vnode.children),
				m(Nav, { items: items }, []),
			];
		},
	};
};

export default Layout;
