import m from "../libraries/mithril";
import type { ApiResponse } from "../models/api";
import type { Bookshelf, BookshelfId, UserBook } from "../models/database";
import { Err, from, Ok, type Result } from "../utils";

const responseToResult = <T>(response: ApiResponse<T>): Result<T> => {
	if (response.code === undefined) {
		return Ok(response.data);
	}

	return Err(new Error(response.message));
};

export const getBookshelves = async (): Promise<Result<Bookshelf[]>> => {
	return responseToResult(
		await m.request<ApiResponse<Bookshelf[]>>("/api/bookshelves", {
			method: "GET",
		}),
	);
};

export const getBooks = async (
	id: BookshelfId,
): Promise<Result<UserBook[]>> => {
	return responseToResult(
		await m.request<ApiResponse<UserBook[]>>("/api/bookshelves/:id", {
			params: {
				id: from(id),
			},
			method: "GET",
		}),
	);
};
