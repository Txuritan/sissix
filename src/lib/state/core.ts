import { writable } from "svelte/store";

import { EMPTY_FILLED_BOOK } from "$lib/models";

export const addOpen = writable<boolean>(false);
export const navOpen = writable<boolean>(false);
export const settingsOpen = writable<boolean>(false);

export const importOpen = writable<boolean>(false);
export const importIsbn = writable<string>("");

export const editEntryOpen = writable<boolean>(false);
export const viewEntryOpen = writable<boolean>(false);

export const addEntry = writable(structuredClone(EMPTY_FILLED_BOOK));
export const editEntry = writable(structuredClone(EMPTY_FILLED_BOOK));
export const viewEntry = writable(structuredClone(EMPTY_FILLED_BOOK));

export const cameras = writable<MediaDeviceInfo[]>([]);
