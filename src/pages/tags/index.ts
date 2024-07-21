import m from "../../libraries/mithril";

export const Tags: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("h1", "Tags!");
		},
	};
};
