import m from "../../libraries/mithril";

export const Tile: m.ClosureComponent<m.Attributes | undefined> = (vnode) => {
	return {
		view: (vnode) => {
			return m(
				"div",
				{
					class: `flex items-start content-between m-2 shadow-sm ${vnode.attrs?.class || ""}`,
				},
				vnode.children,
			);
		},
	};
};

export const TileIcon: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("div", { class: "tile-icon" }, vnode.children);
		},
	};
};

export const TileContent: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("div", { class: "flex flex-col flex-auto" }, vnode.children);
		},
	};
};

export const TileTitle: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("div", { class: "leading-normal" }, vnode.children);
		},
	};
};

export const TileSubtitle: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m(
				"div",
				{ class: "leading-normal text-sm text-zinc-600" },
				vnode.children,
			);
		},
	};
};

export const TileAction: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("div", { class: "tile-action" }, vnode.children);
		},
	};
};
