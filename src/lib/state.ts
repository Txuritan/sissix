import { writable } from "svelte/store";

import { EMPTY_FILLED_BOOK } from "./models";

export const navOpen = writable<boolean>(false);

export const editEntryOpen = writable<boolean>(false);
export const viewEntryOpen = writable<boolean>(false);

export const addEntry = writable(structuredClone(EMPTY_FILLED_BOOK));
export const editEntry = writable(structuredClone(EMPTY_FILLED_BOOK));
export const viewEntry = writable(structuredClone(EMPTY_FILLED_BOOK));
