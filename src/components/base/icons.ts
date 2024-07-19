import m from "../../libraries/mithril";

export interface IconProps {
	width?: string;
	height?: string;
	fill?: string;
}

const Wrapper: m.ClosureComponent<IconProps | undefined> = (vnode) => {
	const props = vnode.attrs || {};

	const width = props.width || "24px";
	const height = props.height || "24px";
	const fill = props.fill || "currentColor";

	return {
		view: (vnode) => {
			return m(
				"svg",
				{
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: "0 -960 960 960",
					width: width,
					height: height,
					fill: fill,
				},
				vnode.children,
			);
		},
	};
};

export const Add: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
				}),
			);
		},
	};
};

export const Book: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z",
				}),
			);
		},
	};
};

export const Shelf: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z",
				}),
			);
		},
	};
};

export const Tag: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "m240-160 40-160H120l20-80h160l40-160H180l20-80h160l40-160h80l-40 160h160l40-160h80l-40 160h160l-20 80H660l-40 160h160l-20 80H600l-40 160h-80l40-160H360l-40 160h-80Zm140-240h160l40-160H420l-40 160Z",
				}),
			);
		},
	};
};

export const Wishlist: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "M446-80q-15 0-30-6t-27-18L103-390q-12-12-17.5-26.5T80-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T879-800v287q0 16-6 30.5T856-457L503-104q-12 12-27 18t-30 6Zm0-80 353-354v-286H513L160-446l286 286Zm253-480q25 0 42.5-17.5T759-700q0-25-17.5-42.5T699-760q-25 0-42.5 17.5T639-700q0 25 17.5 42.5T699-640ZM480-480Z",
				}),
			);
		},
	};
};

export const Settings: m.ClosureComponent<IconProps | undefined> = () => {
	return {
		view: (vnode) => {
			return m(
				Wrapper,
				{ ...vnode.attrs },
				m("path", {
					d: "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z",
				}),
			);
		},
	};
};
