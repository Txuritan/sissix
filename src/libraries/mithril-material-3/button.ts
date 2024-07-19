import m from "../mithril";

type Kinds = "elevated" | "filled" | "tonal" | "outlined" | "text";

const BTN =
	"hover:after:content-none hover:after:absolute hover:after:inset-0 hover:after:rounded-[6.25rem] hover:after:bg-white hover:after:opacity-[0.08] focus:after:content-none focus:after:absolute focus:after:inset-0 focus:after:rounded-[6.25rem] focus:after:bg-white focus:after:opacity-[0.12]";
const BTN_ELEVATED = "";
const BTN_OUTLINE = "hover:bg-primary-600/[0.08] focus:bg-primary-600/[0.12]";
const BTN_TONAL = "";

const BASE =
	"relative flex flex-row items-center justify-center gap-x-2 py-2.5 px-6 rounded-[6.25rem] text-sm tracking-[0.00714em] font-medium";

const KIND: { [KEY in Kinds]: string } = {
	elevated: BASE,
	filled: `${BASE} btn hover:shadow-md`,
	tonal: BASE,
	outlined: `${BASE} btn-outline border`,
	text: BASE,
};

const STATE: { [KEY in Kinds]: [string, string] } = {
	elevated: [
		"btn-elevated shadow-lg bg-surface-100 hover:bg-surface-200 focus:bg-surface-400 text-primary-600 dark:bg-surfaceDark-100 dark:hover:bg-surfaceDark-200 dark:focus:bg-surfaceDark-400 dark:text-primary-200",
		"btn hover:shadow-md",
	],
	filled: [
		"bg-primary-600 text-white dark:bg-primary-200 dark:text-primary-800",
		"",
	],
	tonal: [
		"btn-tonal hover:shadow bg-secondary-100 text-primary-900 dark:bg-secondary-700 dark:text-secondary-100",
		"btn hover:shadow-md",
	],
	outlined: [
		"border-gray-500 text-primary-600 dark:border-gray-400 dark:text-primary-200",
		"border-neutral-200 dark:border-neutral-400 dark:text-neutral-400",
	],
	text: [
		"text-primary-600 hover:bg-surface-200 focus:bg-surface-400 dark:text-primary-200 dark:hover:bg-surfaceDark-200 dark:focus:bg-surfaceDark-400",
		"text-neutral-400",
	],
};

export interface ButtonAttrs {
	disabled?: boolean;
	icon?: m.Component;
	kind?: Kinds;
}

export const Button: m.ClosureComponent<
	(ButtonAttrs & m.Attributes) | undefined
> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs || { kind: "elevated" };

			const kind = attrs.kind || "elevated";
			const disabled = attrs.disabled || false;

			const kindCss = KIND[kind];
			const stateCss = STATE[kind][+disabled];

			return m(
				"button",
				{ class: `${kindCss} ${stateCss}`, disabled: disabled },
				[attrs.icon ? m(attrs.icon) : [], vnode.children],
			);
		},
	};
};
