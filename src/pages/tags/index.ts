import m from "@/mithril";

import Layout from "pages/layout";

export const Tags: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m(Layout, [m("h1", "Tags!")]);
		},
	};
};
