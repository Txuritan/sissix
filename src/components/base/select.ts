import m from "../../libraries/mithril";

export const Select: m.ClosureComponent<m.Attributes | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				"select",
				{
					...(vnode.attrs || {}),
					class:
						"bg-white border border-zinc-400 leading-normal text-base rounded-sm h-9 max-w-64 py-1.5 pl-2 pr-6",
				},
				vnode.children,
			);
		},
	};
};

export const Option: m.ClosureComponent = () => {
	return {
		view: (vnode) => {
			return m("option", vnode.children);
		},
	};
};
