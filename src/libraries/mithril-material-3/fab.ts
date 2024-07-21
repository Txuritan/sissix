import m from "@/mithril";

import type { Elevation, Kind, Sizes } from "./core";
import { ELEVATION, KIND, SIZE, defaultElevation, defaultKind, defaultSize } from "./core";

export interface FabAttributes extends m.Attributes {
	icon: m.Child;

	elevation?: Elevation;
	kind?: Kind;
	size?: Sizes;
}

export const Fab: m.ClosureComponent<FabAttributes> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			const elevation = ELEVATION[attrs.elevation || defaultElevation];
			const kind = KIND[attrs.kind || defaultKind];
			const size = SIZE[attrs.size || defaultSize];

			return [
				vnode.children,
				m("button", { ...attrs, class: `a-fab ${elevation} ${kind} ${size}` }, [
					attrs.icon,
				])
			];
		},
	};
};
