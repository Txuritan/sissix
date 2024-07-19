import m from "../../libraries/mithril";

export const Divider: m.ClosureComponent = () => {
	return {
		view: (vnode) => {
			return m("div", { class: "h-1.5 bg-zinc-100" }, []);
		},
	};
};

export default Divider;
