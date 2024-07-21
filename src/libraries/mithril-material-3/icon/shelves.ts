import m from "@/mithril";

import { IconBase, type IconProps } from "./base";

export const Shelves: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || {};

			const filled = attrs.filled || false;

			const OUTLINED =
				"M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z";
			const FILLED =
				"M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Z";

			return m(
				IconBase,
				{ ...vnode.attrs },
				m("path", {
					d: filled ? FILLED : OUTLINED,
				}),
			);
		},
	};
};
