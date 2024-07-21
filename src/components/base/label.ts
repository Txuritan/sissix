import m from "@/mithril";

export const Label: m.ClosureComponent<m.Attributes | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				"label",
				{
					...(vnode.attrs || {}),
					class: "block text-lg font-semibold leading-normal py-1",
				},
				vnode.children,
			);
		},
	};
};
