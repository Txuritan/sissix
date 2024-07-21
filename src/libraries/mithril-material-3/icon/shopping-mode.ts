import m from "@/mithril";

import { IconBase, type IconProps } from "./base";

export const ShoppingMode: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || {};

			const filled = attrs.filled || false;

			const OUTLINED =
				"M446-80q-15 0-30-6t-27-18L103-390q-12-12-17.5-26.5T80-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T879-800v287q0 16-6 30.5T856-457L503-104q-12 12-27 18t-30 6Zm0-80 353-354v-286H513L160-446l286 286Zm253-480q25 0 42.5-17.5T759-700q0-25-17.5-42.5T699-760q-25 0-42.5 17.5T639-700q0 25 17.5 42.5T699-640ZM480-480Z";
			const FILLED =
				"M447-80q-15 0-30-6t-27-18L104-390q-12-12-17.5-26.5T81-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T880-800v287q0 16-6 30.5T857-457L504-104q-12 12-27 18t-30 6Zm253-560q25 0 42.5-17.5T760-700q0-25-17.5-42.5T700-760q-25 0-42.5 17.5T640-700q0 25 17.5 42.5T700-640Z";

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
