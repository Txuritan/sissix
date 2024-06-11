export interface Entity {
    id: number | undefined;
    content: string;
}

export interface EntityLink {
    parent_id: number;
    entity_id: number;
}

export enum BookType {
    Paperback,
    Hardcover,
    Digital,
    Audiobook,
}

export interface Book {
    id: number | undefined;
    cover: string;
    title: string;
    subtitle: string;
    type: BookType;
    published: Date;
    pages: number;
    description: string;

    bbid: string;
    isbn10: string;
    isbn13: string;
    olid: string;

    owned: boolean;
    // TODO: this should be `Date | null` but i need to get the input working first
    purchased: Date;
    rating: number;
}

export enum StatusState {
    ToRead,
    Reading,
    Finished,
    Abandoned,
}

export enum StatusType {
    Pages,
    Percentage,
    Time,
}

export interface Status {
    id?: number;
    parent_id: number;
    state: StatusState;
    type: StatusType;
}

export interface StatusEntry {
    id?: number;
    parent_id: number;
    amount: string;
    time: Date;
}

export interface FilledStatus extends Status {
    entry: StatusEntry[];
}

export interface FilledBook extends Book {
    author: Entity[];
    publisher: Entity[];
    series: Entity[];
    category: Entity[];

    tag: Entity[];
    review: Entity[];
    note: Entity[];
    quote: Entity[];
    loan: Entity[];

    status: FilledStatus[];
}

export const EMPTY_FILLED_BOOK: FilledBook = {
    id: undefined,
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
};
