import m from "../../libraries/mithril";

export const Tabs: m.ClosureComponent = (_vnode) => {
	return {
		view: (vnode) => {
			return m(
				"ul",
				{
					class:
						"bg-green-50 flex flex-wrap items-center tab-block select-none",
				},
				vnode.children,
			);
		},
	};
};

export interface TabProps {
	active?: boolean;
}

export const Tab: m.ClosureComponent<TabProps | undefined> = (_vnode) => {
	return {
		view: (vnode) => {
			const props = vnode.attrs;

			const active =
				props?.active || false
					? "text-green-600 border-green-600"
					: "border-transparent";

			return m(
				"li",
				{
					class: `flex-1 border-b-4 mt-4 hover:text-green-600 focus:ring focus:ring-green-300 ${active}`,
				},
				vnode.children,
			);
		},
	};
};

export interface TabLinkProps {
	href: string;
}

export const TabLink: m.ClosureComponent<TabLinkProps> = (_vnode) => {
	return {
		view: (vnode) => {
			const props = vnode.attrs;

			const isActive = m.route.get() === props.href;

			return m(Tab, { active: isActive }, [
				m(m.route.Link, { href: props.href }, vnode.children),
			]);
		},
	};
};
