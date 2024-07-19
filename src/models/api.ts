export type Response<T> = { code: undefined; message: undefined; data: T };

export type ErrorNotFound = { code: "NOT_FOUND"; message: string };
export type ErrorServerError = {
	code: "INTERNAL_SERVER_ERROR";
	message: string;
};

export type ApiResponse<T> = Response<T> | ErrorNotFound | ErrorServerError;
