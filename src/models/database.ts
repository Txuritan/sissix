export type AuthorId = { value: string; readonly __tag: unique symbol };

export interface Author {
	id: AuthorId;
}

export type PublisherId = { value: string; readonly __tag: unique symbol };

export interface Publisher {
	id: PublisherId;
}

export type SeriesId = { value: string; readonly __tag: unique symbol };

export interface Series {
	id: SeriesId;
}

export enum BookType {
	Audiobook = 0,
	Hardcover = 1,
	Digital = 2,
	Paperback = 3,
}

export type BookId = { value: string; readonly __tag: unique symbol };

export interface Book {
	readonly id: BookId;

	readonly cover: string;

	readonly title: string;
	readonly subtitle?: string;
	readonly type: BookType;
	readonly pages: number;
	readonly description: string;
	readonly published: Date;

	readonly isbn10?: string;
	readonly isbn13?: string;
	readonly lcc?: string; // Library of Congress Classification ID
	readonly mds?: string; // Melvil Decimal System ID
	readonly olid?: string; // OpenLibrary ID

	readonly authors?: Author[];
	readonly publishers?: Publisher[];
	readonly series?: Series[];
}

export type UserBookId = { value: string; readonly __tag: unique symbol };

export interface UserBook {
	readonly id: UserBookId;
	readonly book: Book;

	readonly rating: number;
	readonly purchased: Date;
}

export type BookshelfId = { value: string; readonly __tag: unique symbol };

export interface Bookshelf {
	readonly id: BookshelfId;
	readonly name: string;
}
