import m from "../../libraries/mithril";

type Colors = "default" | "error" | "success";
type Kinds = "default" | "primary" | "link";
type Sizes = "default" | "block" | "large" | "small";
type States = "default" | "active" | "disabled" | "loading";
type Types = "default" | "action" | "circle";

export interface ButtonProps {
	class?: string;

	color?: Colors;
	kind?: Kinds;
	size?: Sizes;
	state?: States;
	type?: Types;
}

const COLOR: { [KEY in Colors]: string } = {
	default: "",
	error: "btn-error",
	success: "btn-success",
};

const KIND: { [KEY in Kinds]: string } = {
	default: "",
	primary: "bg-green-600 active:bg-green-700 text-white",
	link: "btn-link",
};

const SIZE: { [KEY in Sizes]: string } = {
	default: "",
	block: "btn-block",
	large: "h-12 min-w-12",
	small: "btn-sm",
};

const STATE: { [KEY in States]: string } = {
	default: "",
	active: "active",
	disabled: "disabled",
	loading: "loading",
};

const TYPE: { [KEY in Types]: string } = {
	default: "",
	action: "",
	circle: "rounded-full",
};

export const Button: m.ClosureComponent<ButtonProps | undefined> = (vnode) => {
	const props = vnode.attrs;

	const className = props?.class || "";

	const color = COLOR[props?.color || "default"];
	const kind = KIND[props?.kind || "default"];
	const size = SIZE[props?.size || "default"];
	const state = STATE[props?.state || "default"];
	const type = TYPE[props?.type || "default"];

	return {
		view: (vnode) => {
			return m(
				"button",
				{
					class: `flex items-center justify-center ${color} ${kind} ${size} ${state} ${type} ${className}`,
				},
				vnode.children,
			);
		},
	};
};

export default Button;
