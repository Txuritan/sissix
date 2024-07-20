import type * as api from "../models/api";
import type { Bookshelf, BookshelfId, UserBook } from "../models/database";
import { Err, from, Ok, type Result } from "../utils";

type FetchResponse<T> =
	| (Omit<Response, "json"> & {
			status: 200;
			json: () => api.Response<T> | PromiseLike<api.Response<T>>;
		})
	| (Omit<Response, "json"> & {
			status: 404;
			json: () => api.ErrorNotFound | PromiseLike<api.ErrorNotFound>;
		})
	| (Omit<Response, "json"> & {
			status: 500;
			json: () => api.ErrorServerError | PromiseLike<api.ErrorServerError>;
		});

const fetchWrapper = async <T>(method: string, url: string): Promise<Result<T>> => {
	const res = (await fetch(url, {
		method: method,
		headers: {
			Accept: "application/json",
		},
	})) as FetchResponse<T>;

	if (res.status === 200) {
		const json = await res.json();

		return Ok(json.data);
	}

	if (res.status === 404 || res.status === 500) {
		const json = await res.json();

		return Err(new Error(json.message));
	}

	return Err(new Error(`Fetch '${url}' responded with an unknown status code`));
};

export const getBookshelves = async (): Promise<Result<Bookshelf[]>> => fetchWrapper("GET", "/api/bookshelves");

export const getBooks = async (id: BookshelfId): Promise<Result<UserBook[]>> => fetchWrapper("GET", `/api/bookshelves/${from(id)}`);
