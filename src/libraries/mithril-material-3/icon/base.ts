import m from "../../../libraries/mithril";

export interface IconProps {
	width?: string;
	height?: string;
	fill?: string;
	filled?: boolean;
}

export const IconBase: m.ClosureComponent<IconProps | undefined> = (vnode) => {
	const attrs = vnode.attrs || {};

	const width = attrs.width || "24px";
	const height = attrs.height || "24px";
	const fill = attrs.fill || "currentColor";

	return {
		view: (vnode) => {
			return m(
				"svg",
				{
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: "0 -960 960 960",
					width: width,
					height: height,
					fill: fill,
				},
				vnode.children,
			);
		},
	};
};
