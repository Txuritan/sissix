import m from "@/mithril";

import { Label } from "../../components/base/label";
import { Select, Option } from "../../components/base/select";

export const Settings: m.ClosureComponent = () => {
	return {
		view: (_vnode) => {
			return [
				m("h2", { class: "text-2xl m-2" }, "Camera"),
				m("div", { class: "p-2 mx-2 rounded-md shadow-sm" }, [
					m(Label, { for: "settings-camera-selection" }, "Camera Selection"),
					m(Select, { id: "settings-camera-selection" }, [
						m(Option, "Choose an option"),
						m(Option, "Slack"),
						m(Option, "Skype"),
						m(Option, "Hipchat"),
					]),
				]),
				m("h2", { class: "text-2xl m-2" }, "Database"),
				m("div", { class: " p-2 mx-2 rounded-md shadow-sm" }, []),
				m("h2", { class: "text-2xl m-2" }, "Search"),
				m("div", { class: "p-2 mx-2 rounded-md shadow-sm" }, [
					m(Label, { for: "settings-search-provider" }, "Search Provider"),
					m(Select, { id: "settings-search-provider" }, [
						m(Option, "Choose an option"),
						m(Option, "Slack"),
						m(Option, "Skype"),
						m(Option, "Hipchat"),
					]),
				]),
			];
		},
	};
};
