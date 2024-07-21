import m from "@/mithril";

import { IconBase, type IconProps } from "./base";

export const Add: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				IconBase,
				{ ...vnode.attrs },
				m("path", {
					d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
				}),
			);
		},
	};
};
