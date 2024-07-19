import m from "../mithril";

type Sizes = "small" | "medium" | "large";

export interface FabAttrs {
	size?: Sizes;
}

const SIZE: { [KEY in Sizes]: string } = {
	small: "-small",
	medium: "-medium",
	large: "-large",
};

export const Fab: m.ClosureComponent<
	(FabAttrs & m.Attributes) | undefined
> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || { size: "medium" };

			const size = SIZE[attrs.size || "medium"];

			return m("div", { class: `a-fab ${size}` }, vnode.children);
		},
	};
};
