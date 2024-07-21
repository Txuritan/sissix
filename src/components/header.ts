import m from "@/mithril";
import { MoreVert } from "@/mithril-material-3/icon/more-vert";

export interface HeaderAttrs extends m.Attributes {
	title: string;
	subtitle?: string;
}

export const Header: m.ClosureComponent<HeaderAttrs> = () => {
	return {
		view: (vnode) => {
			const attrs = vnode.attrs;

			return m("div", { class: "flex items-center" }, [
				m("span", { class: "flex flex-grow items-center" }, [
					m("h2", { class: "text-2xl m-2 text-on-surface" }, attrs.title),
					attrs.subtitle
						? m("h2", { class: "text-on-surface-variant" }, attrs.subtitle)
						: [],
				]),
				m(MoreVert),
			]);
		},
	};
};
