import m from "./mithril";
import { nanoid } from "./nanoid";

enum Type {
	Info = 0,
	Success = 1,
	Warning = 2,
	Danger = 3,
}

interface Toast {
	id: string;
	type: Type;
	text: string;
	timeout: number;
}

interface State {
	list: Toast[];
	destroy: (toast: Toast) => void;
}

const state: State = {
	list: [],
	destroy: (toast: Toast) => {
		const index = state.list.findIndex((entry) => entry.id === toast.id);
		state.list.slice(index, 1);
	},
};

export const addSuccess = (text: string, timeout = 3000) => {
	state.list.push({ id: nanoid(), type: Type.Success, text, timeout });
};

export const addInfo = (text: string, timeout = 3000) => {
	state.list.push({ id: nanoid(), type: Type.Info, text, timeout });
};

export const addWarning = (text: string, timeout = 3000) => {
	state.list.push({ id: nanoid(), type: Type.Warning, text, timeout });
};

export const addDanger = (text: string, timeout = 3000) => {
	state.list.push({ id: nanoid(), type: Type.Danger, text, timeout });
};

export const Drawer: m.ClosureComponent = () => {
	return {
		view: () => {
			return m(
				"div",
				state.list.map((toast) => {
					return m("div", { key: toast.id }, m(Bread, { toast: toast }));
				}),
			);
		},
	};
};

interface BreadAttrs extends m.Attributes {
	toast: Toast;
}

const Bread: m.ClosureComponent<BreadAttrs> = () => {
	return {
		oninit: (vnode) => {
			setTimeout(() => {
				state.destroy(vnode.attrs.toast);
			}, vnode.attrs.toast.timeout);
		},
		onbeforeremove: (vnode) => {
			vnode.dom.classList.add("");

			setTimeout(() => {
				state.destroy(vnode.attrs.toast);
				m.redraw();
			}, 300);
		},
		view: (vnode) => {
			return m("div");
		},
	};
};
