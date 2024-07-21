import m from "@/mithril";

type Kinds = "outlined" | "elevated" | "filled";

export interface CardAttrs {
	kind?: Kinds;
}

const KIND: { [KEY in Kinds]: string } = {
	outlined: "-outlined",
	elevated: "-elevated",
	filled: "-filled",
};

export const Card: m.ClosureComponent<
	(CardAttrs & m.Attributes) | undefined
> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || { kind: "outlined" };

			const kind = KIND[attrs.kind || "outlined"];

			return m("div", { class: `a-card ${kind}` }, vnode.children);
		},
	};
};
