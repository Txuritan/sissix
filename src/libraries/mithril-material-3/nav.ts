import m from "@/mithril";

import type { IconProps } from "./icon/base";

export interface TabsAttr extends m.Attributes {
	items: NavItemAttr[];
}

export const Nav: m.ClosureComponent<TabsAttr> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			return m("div", { class: "a-nav" }, [
				m(
					"div",
					{ class: "a-nav--container" },
					attrs.items.map((item) => {
						return m(NavItem, { ...item }, []);
					}),
				),
			]);
		},
	};
};

export interface NavItemAttr extends m.RouteLinkAttrs {
	icon: m.ClosureComponent<IconProps>;
	badge?: string;
	label: string;
}

export const NavItem: m.ClosureComponent<NavItemAttr> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			const isActive = m.route.get() === attrs.href;

			return m(
				m.route.Link,
				{ ...attrs, class: `a-nav_item${isActive ? " -active" : ""}` },
				[
					m("div", { class: "a-nav_item--icon" }, [
						m(attrs.icon, { filled: isActive }),
						attrs.badge ? m("div", { class: "a-nav_item--badge" }, []) : [],
					]),
					m("div", { class: "a-nav_item--text" }, attrs.label),
				],
			);
		},
	};
};
