import m from "../mithril";

type Elevation = "none" | "small" | "medium" | "large";
type Kind = "fill" | "primary" | "secondary" | "tertiary";
type Sizes = "small" | "medium" | "large" | "extra";

export interface FabAttrs extends m.Attributes {
	icon: m.Child;
	elevation?: Elevation;
	kind?: Kind;
	size?: Sizes;
}

const ELEVATION: { [KEY in Elevation]: string } = {
	none: "-elevation-none",
	small: "-elevation-small",
	medium: "-elevation-medium",
	large: "-elevation-large",
};

const KIND: { [KEY in Kind]: string } = {
	fill: "-fill",
	primary: "-primary",
	secondary: "-secondary",
	tertiary: "-tertiary",
};

const SIZE: { [KEY in Sizes]: string } = {
	small: "-small",
	medium: "-medium",
	large: "-large",
	extra: "-extra",
};

export const Fab: m.ClosureComponent<FabAttrs & m.Attributes> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			const elevation = ELEVATION[attrs.elevation || "none"];
			const kind = KIND[attrs.kind || "primary"];
			const size = SIZE[attrs.size || "medium"];

			return m.fragment({}, [
				vnode.children,
				m("button", { ...attrs, class: `a-fab ${elevation} ${kind} ${size}` }, [
					attrs.icon,
				])
			]);
		},
	};
};
