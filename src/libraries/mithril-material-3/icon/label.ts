import m from "../../../libraries/mithril";

import { IconBase, type IconProps } from "./base";

export const Label: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || {};

			const filled = attrs.filled || false;

			const OUTLINED =
				"M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Zm-98 0L600-680H200v400h400l142-200Zm-542 0v200-400 200Z";
			const FILLED =
				"M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Z";

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
