import m from "@/mithril";

export const Setup: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("h1", "Tags!");
		},
	};
};
