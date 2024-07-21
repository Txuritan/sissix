import m from "@/mithril";

import type { Elevation, Kind, Shapes, Sizes } from "./core";
import { ELEVATION, KIND, SHAPE, SIZE, defaultElevation, defaultKind, defaultShape, defaultSize } from "./core";

export interface ButtonAttributes extends m.Attributes {
	disabled?: boolean;
	icon?: m.Child;

	elevation?: Elevation;
	kind?: Kind;
	shape?: Shapes;
	size?: Sizes;
}

export const Button: m.ClosureComponent<ButtonAttributes> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			const disabled = attrs.disabled || false;

			const elevation = ELEVATION[attrs.elevation || defaultElevation];
			const kind = KIND[attrs.kind || defaultKind];
			const shape = SHAPE[attrs.shape || defaultShape];
			const size = SIZE[attrs.size || defaultSize];

			return m(
				"button",
				{ class: `a-button ${elevation} ${kind} ${shape} ${size}`, disabled: disabled },
				[attrs.icon ? attrs.icon : [], vnode.children],
			);
		},
	};
};
