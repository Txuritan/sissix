import Dexie, { type EntityTable } from "../libraries/dexie";

import { BookType } from "../models/database";
import type {
	Book,
	BookId,
	Bookshelf,
	BookshelfId,
	UserBook,
	UserBookId,
} from "../models/database";

import { arrayShuffle, Err, Ok, type Result, to } from "../utils";

const createBook = (
	userId: string,
	bookId: string,
	cover: string,
): UserBook => {
	return {
		id: to<UserBookId>(userId),
		book: {
			id: to<BookId>(bookId),

			cover: cover,

			title: "",
			type: BookType.Paperback,
			pages: 0,
			description: "",
			published: new Date(),
		},
		rating: 0,
		purchased: new Date(),
	};
};

// biome-ignore format: Get way too nig to easily edit
const BOOKS: UserBook[] = [
    createBook("ybw-djFeWs3vbQf25xECQ", "T62kQhbo_aIOeCpwHrQGi", "./public/0009276845-L.jpg"),
    createBook("LPJ8qsBpZ1y8P_rYIT9Gh", "_GxMZyg9UKMitNaR5Edv9", "./public/0009970034-L.jpg"),
    createBook("xOkcThsOnbJZunwyT7-WQ", "XCOIWR0WVVl3w-xU_7E1C", "./public/0010128852-L.jpg"),
    createBook("Z6DOq8S4Myv_3zARzpKqi", "Vy6o4DHiOD4oLsX0spCkB", "./public/0011865531-L.jpg"),
    createBook("YeastuskxRucUS6LcVGgM", "pCXbm02mtO-nLh4vSDLv7", "./public/0011918737-L.jpg"),
    createBook("5UsM88R9aWmu_99QE_txN", "p9uMVa7JPB8KHww4T23-y", "./public/0011922810-L.jpg"),
    createBook("B4co_lLhlipaaqJIOfd_q", "05R5JdXJnKCPXKXkhQ5kg", "./public/0012791623-L.jpg"),
    createBook("2_ngDyhiju9ICYcj74e9I", "c9Qid8p9zEPqx6F4SF4KE", "./public/0013070958-L.jpg"),
    createBook("77k448mgkXtvNt3ZAatR-", "tJjkqPq-S_Ps9IYBbxpcs", "./public/0013416640-L.jpg"),
    createBook("c_ge0A-VrqeUyAeIYwUUG", "4hauXlVpAPYklHr34ZIca", "./public/3002898-L.jpg"),
    createBook("X1i9K4u6PAQuKNnxPicjH", "k-BhTcS47DH67PC2MM9jB", "./public/4607078-L.jpg"),
    createBook("FaX5sR_EfK5fd6Rxp0r3H", "KiXRSYeIzMbMOAyKp0698", "./public/5654258-L.jpg"),
    createBook("WHHZAfI1iKOT34Bv67Aew", "BNYH3hfbZ6OioHWCjqrJp", "./public/573479-L.jpg"),
    createBook("8DcfoeHezAOv_RxhLiJCR", "UHOjdK4MZp9abgQMO3Evl", "./public/5742496-L.jpg"),
    createBook("B-a26--EClbZb2Q5lqfP7", "5oeIFqpV-5GcnKiBaUQQb", "./public/6136328-L.jpg"),
    createBook("Iv7BJCsfV7IGi_Wd6LGZX", "sut-OS24Emr1K3veiUVKo", "./public/7132786-L.jpg"),
    createBook("STfmfyurEOWITHNZ-WeJt", "3iJzTSfLDMY2_7LSTO2Sj", "./public/7943675-L.jpg"),
];

const database = new Dexie("sissix") as Dexie & {
	books: EntityTable<Book, "id">;
	userBooks: EntityTable<UserBook, "id">;
	bookshelves: EntityTable<Bookshelf, "id">;
};

database.version(1).stores({
	books: "++id",
	userBooks: "++id",
	bookshelves: "++id",
});

export const getBookshelves = async (): Promise<Result<Bookshelf[]>> => {
	return Ok([
		{
			id: to<BookshelfId>("1"),
			name: "Test Bookshelf",
		},
		{
			id: to<BookshelfId>("2"),
			name: "Test Bookshelf",
		},
		{
			id: to<BookshelfId>("3"),
			name: "Test Bookshelf",
		},
		{
			id: to<BookshelfId>("4"),
			name: "Test Bookshelf",
		},
	]);
};

export const getBooks = async (
	id: BookshelfId,
): Promise<Result<UserBook[]>> => {
	if (id === to<BookshelfId>("1")) {
		return Ok(BOOKS);
	}
	if (id === to<BookshelfId>("2")) {
		return Ok(BOOKS);
	}
	if (id === to<BookshelfId>("3")) {
		return Ok(BOOKS);
	}
	if (id === to<BookshelfId>("4")) {
		return Ok(BOOKS);
	}

	return Err(new Error("Method not implemented."));
};
