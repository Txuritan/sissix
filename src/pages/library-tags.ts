import m from "../libraries/mithril";

export const LibraryTags: m.ClosureComponent = (vnode) => {
	return {
		view: (vnode) => {
			return m("h1", "Tags!");
		},
	};
};

export default LibraryTags;
