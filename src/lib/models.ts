export interface Entity {
    id?: number;
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
    id?: number;
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
