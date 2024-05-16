import { writable } from "svelte/store";

import { BookType, type FilledBook } from "./models";

export const navOpen = writable<boolean>(false);

export const addEntry = writable<FilledBook>({
    cover: "",
    title: "",
    subtitle: "",
    type: BookType.Paperback,
    published: new Date(),
    pages: 0,
    description: "",
    bbid: "",
    isbn10: "",
    isbn13: "",
    olid: "",
    author: [],
    publisher: [],
    series: [],
    category: [],
    owned: false,
    purchased: new Date(),
    rating: 0,
    tag: [],
    review: [],
    note: [],
    quote: [],
    loan: [],
    status: [],
});
