import m from "../libraries/mithril";

export interface ScrollAttrs extends m.Attributes {}

export const Scroll: m.ClosureComponent<ScrollAttrs> = () => {
	return {
		view: (vnode) => {
			return m("div", { class: "" }, vnode.children);
		},
	};
};
