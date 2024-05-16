import Dexie, { type Table } from "dexie";
import "dexie-export-import";

import type * as m from "./models.ts";

class Database extends Dexie {
    public author!: Table<m.Entity, number>;
    public publisher!: Table<m.Entity, number>;
    public series!: Table<m.Entity, number>;
    public category!: Table<m.Entity, number>;
    public tag!: Table<m.Entity, number>;
    public review!: Table<m.Entity, number>;
    public note!: Table<m.Entity, number>;
    public quote!: Table<m.Entity, number>;
    public loan!: Table<m.Entity, number>;

    public book!: Table<m.Book, number>;

    public book_author!: Table<m.EntityLink, [number, number]>;
    public book_publisher!: Table<m.EntityLink, [number, number]>;
    public book_series!: Table<m.EntityLink, [number, number]>;
    public book_category!: Table<m.EntityLink, [number, number]>;
    public book_tag!: Table<m.EntityLink, [number, number]>;
    public book_review!: Table<m.EntityLink, [number, number]>;
    public book_note!: Table<m.EntityLink, [number, number]>;
    public book_quote!: Table<m.EntityLink, [number, number]>;
    public book_loan!: Table<m.EntityLink, [number, number]>;

    public status!: Table<m.Status, number>;
    public status_entry!: Table<m.StatusEntry, number>;

    public constructor() {
        super("sissix");

        this.version(1).stores({
            "author": "++id,&content",
            "publisher": "++id,&content",
            "series": "++id,&content",
            "category": "++id,&content",
            "tag": "++id,&content",
            "review": "++id",
            "note": "++id",
            "quote": "++id",
            "loan": "++id",

            "book": "++id,title,bbid,isbn10,isbn13,olid",

            "book_author": "[parent_id+entity_id],parent_id",
            "book_publisher": "[parent_id+entity_id],parent_id",
            "book_series": "[parent_id+entity_id],parent_id",
            "book_category": "[parent_id+entity_id],parent_id",
            "book_tag": "[parent_id+entity_id],parent_id",
            "book_review": "[parent_id+entity_id],parent_id",
            "book_note": "[parent_id+entity_id],parent_id",
            "book_quote": "[parent_id+entity_id],parent_id",
            "book_loan": "[parent_id+entity_id],parent_id",

            "status": "++id,parent_id",
            "status_entry": "++id,parent_id",
        });

        this.open();
    }

    async backup(): Promise<Blob> {
        return await this.export();
    }

    async restore(blob: Blob) {
        await this.delete();
        await this.import(blob);
    }

    private async getEntryOrAdd(table: Table<m.Entity, number>, entry: m.Entity): Promise<number> {
        let id = await table
            .where("content").equals(entry.content)
            .first()
            .then(a => a != undefined ? a.id : undefined);
        if (id == undefined) {
            id = await table.add(entry);
        }

        return id;
    }

    private async getAllEntities(entity_table: Table<m.Entity, number>, link_table: Table<m.EntityLink, [number, number]>, parent_id: number) {
        const entity_links = await link_table.where("parent_id").equals(parent_id).toArray();
        const entities = await entity_table.bulkGet(entity_links.map(link => link.entity_id));

        return entities.filter(entity => entity != undefined).map(entity => entity as m.Entity);
    }

    private async addEntityLink(entity_table: Table<m.Entity, number>, link_table: Table<m.EntityLink, [number, number]>, entity: m.Entity, parent_id: number) {
        const entity_id = await this.getEntryOrAdd(entity_table, entity);

        if ((await link_table.get([parent_id, entity_id])) != undefined) {
            return;
        }

        await link_table.add({ parent_id: parent_id, entity_id: entity_id });
    }

    async addBook(book: m.FilledBook): Promise<number> {
        type EntityRelation = [Table<m.Entity, number>, Table<m.EntityLink, [number, number]>, m.Entity[]];

        const book_id = await this.book.add({
            cover: book.cover,
            title: book.title,
            subtitle: book.subtitle,
            type: book.type,
            published: book.published,
            pages: book.pages,
            description: book.description,
            bbid: book.bbid,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            olid: book.olid,
            owned: book.owned,
            purchased: book.purchased,
            rating: book.rating,
        });

        const entities: EntityRelation[] = [
            [this.author, this.book_author, book.author],
            [this.publisher, this.book_publisher, book.publisher],
            [this.series, this.book_series, book.series],
            [this.category, this.book_category, book.category],

            [this.tag, this.book_tag, book.tag],
            [this.review, this.book_review, book.review],
            [this.note, this.book_note, book.note],
            [this.quote, this.book_quote, book.quote],
            [this.loan, this.book_loan, book.loan],
        ];

        for (const [table, link_table, array] of entities) {
            for (const item of array) {
                await this.addEntityLink(table, link_table, item, book_id);
            }
        }

        // TODO: handle read status'

        return book_id;
    }

    async getBook(book: m.Book): Promise<m.FilledBook | undefined> {
        if (book.id == undefined) {
            return undefined;
        }

        return {
            id: book.id,
            cover: book.cover,
            title: book.title,
            subtitle: book.subtitle,
            type: book.type,
            published: book.published,
            pages: book.pages,
            description: book.description,
            bbid: book.bbid,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            olid: book.olid,
            owned: book.owned,
            purchased: book.purchased,
            rating: book.rating,
            author: await this.getAllEntities(this.author, this.book_author, book.id),
            publisher: await this.getAllEntities(this.publisher, this.book_publisher, book.id),
            series: await this.getAllEntities(this.series, this.book_series, book.id),
            category: await this.getAllEntities(this.category, this.book_category, book.id),
            tag: await this.getAllEntities(this.tag, this.book_tag, book.id),
            review: await this.getAllEntities(this.review, this.book_review, book.id),
            note: await this.getAllEntities(this.note, this.book_note, book.id),
            quote: await this.getAllEntities(this.quote, this.book_quote, book.id),
            loan: await this.getAllEntities(this.loan, this.book_loan, book.id),
            status: [],
        };
    }

    async getAllBooks(): Promise<m.FilledBook[]> {
        const filled_books: m.FilledBook[] = [];

        for (const book of await this.book.toArray()) {
            const filled_book = await this.getBook(book);
            if (filled_book == undefined) {
                continue;
            }

            filled_books.push(filled_book);
        }

        return filled_books;
    }
}

const DB = new Database();

export default DB;
