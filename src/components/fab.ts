import m from "../libraries/mithril";

export const Fab: m.ClosureComponent = () => {
	return {
		view: (vnode) => {
			return m("div", { class: "absolute bottom-24 right-6" }, vnode.children);
		},
	};
};

export default Fab;
