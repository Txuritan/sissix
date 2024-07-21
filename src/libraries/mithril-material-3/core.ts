export type Elevation = "none" | "small" | "medium" | "large";
export type Kind = "fill" | "primary" | "secondary" | "tertiary";
export type Shapes = "round" | "square";
export type Sizes = "small" | "medium" | "large" | "extra";

export const defaultElevation: Elevation = "none";
export const ELEVATION: { [KEY in Elevation]: string } = {
	none: "-elevation-none",
	small: "-elevation-small",
	medium: "-elevation-medium",
	large: "-elevation-large",
};

export const defaultKind: Kind = "primary";
export const KIND: { [KEY in Kind]: string } = {
	fill: "-fill",
	primary: "-primary",
	secondary: "-secondary",
	tertiary: "-tertiary",
};

export const defaultShape: Shapes = "round";
export const SHAPE: { [KEY in Shapes]: string } = {
	round: "-round",
	square: "-square",
};

export const defaultSize: Sizes = "medium";
export const SIZE: { [KEY in Sizes]: string } = {
	small: "-small",
	medium: "-medium",
	large: "-large",
	extra: "-extra",
};
