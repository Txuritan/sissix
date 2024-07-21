export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

type OptionInner<T> = { some: true; value: T } | { some: false };

interface OptionMatcher<T, O> {
	some(value: T): O;
	none(): O;
}

export class Option<T> {
	private readonly inner: OptionInner<T>;

	private constructor(inner: OptionInner<T>) {
		this.inner = inner;
	}

	public static Some<T>(value: T): Option<T> {
		return new Option<T>({ some: true, value: value });
	}

	public static None<T, E>(): Option<T> {
		return new Option<T>({ some: false });
	}

	public match<O>(matcher: OptionMatcher<T, O>): O {
		if (this.inner.some) {
			return matcher.some(this.inner.value);
		}

		return matcher.none();
	}

	public map<O>(fn: (_: T) => O): Option<O> {
		return this.match({
			some: (t) => Option.Some(fn(t)),
			none: () => Option.None(),
		});
	}

	public andThen<O>(fn: (_: T) => Option<O>): Option<O> {
		return this.match({
			some: (t) => fn(t),
			none: () => Option.None(),
		});
	}

	public unwrapOr(value: T | null): T | null {
		if (this.inner.some) {
			return this.inner.value;
		}

		return value;
	}
}

export const Some = <T>(value: T): Option<T> => {
	return Option.Some(value);
};

export const None = <T>(): Option<T> => {
	return Option.None();
};

type ResultInner<T, E> = { ok: true; value: T } | { ok: false; error: E };

interface ResultMatcher<T, E, O> {
	ok(value: T): O;
	err(error: E): O;
}

export class Result<T, E = Error> {
	private readonly inner: ResultInner<T, E>;

	private constructor(inner: ResultInner<T, E>) {
		this.inner = inner;
	}

	public static Ok<T, E>(value: T): Result<T, E> {
		return new Result<T, E>({ ok: true, value: value });
	}

	public static Err<T, E>(error: E): Result<T, E> {
		return new Result<T, E>({ ok: false, error: error });
	}

	public isOk(): boolean {
		return this.inner.ok;
	}

	public match<O>(matcher: ResultMatcher<T, E, O>): O {
		if (this.inner.ok) {
			return matcher.ok(this.inner.value);
		}

		return matcher.err(this.inner.error);
	}

	public map<O>(fn: (_: T) => O): Result<O, E> {
		return this.match({
			ok: (t) => Result.Ok(fn(t)),
			err: (e) => Result.Err(e),
		});
	}

	public mapErr<O>(fn: (_: E) => O): Result<T, O> {
		return this.match({
			ok: (t) => Result.Ok(t),
			err: (e) => Result.Err(fn(e)),
		});
	}

	public andThen<O>(fn: (_: T) => Result<O, E>): Result<O, E> {
		return this.match({
			ok: (t) => fn(t),
			err: (e) => Result.Err(e),
		});
	}

	public asOk(): Option<T> {
		return this.match({
			ok: (t) => Option.Some(t),
			err: (_) => Option.None(),
		});
	}

	public unwrapOr(value: T | null): T | null {
		if (this.inner.ok) {
			return this.inner.value;
		}

		return value;
	}
}

export const Ok = <T, E = Error>(value: T): Result<T, E> => {
	return Result.Ok(value);
};

export const Err = <T, E = Error>(error: E): Result<T, E> => {
	return Result.Err(error);
};

export const wrapError = <T>(message: string, func: () => T): Result<T> => {
	try {
		return Ok(func());
	} catch (ex: unknown) {
		return Err(new Error(message));
	}
};

export const wrapAsyncError = async <T>(message: string, func: () => Promise<T>): Promise<Result<T>> => {
	try {
		return Ok(await func());
	} catch (ex: unknown) {
		return Err(new Error(message));
	}
};

export function to<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	T extends { readonly __tag: symbol; value: any } = {
		readonly __tag: unique symbol;
		value: never;
	},
>(value: T["value"]): T {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return value as any as T;
}

export function from<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	T extends { readonly __tag: symbol; value: any },
>(value: T): T["value"] {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return value as any as T["value"];
}

export function arrayShuffle<T>(array: T[], seed: number): T[] {
	let currentIndex = array.length;
	let temporaryValue: T;
	let randomIndex: number;

	const random = (seed: number) => {
		// biome-ignore lint/style/noParameterAssign: <explanation>
		const x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	};

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(random(seed) * currentIndex--);

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;

		// biome-ignore lint/style/noParameterAssign: <explanation>
		++seed;
	}

	return array;
}

export const until = (conditionFunction: () => boolean): Promise<void> => {
	const poll = (resolve: () => void) => {
		if (conditionFunction()) {
			resolve();
		} else {
			setTimeout(() => poll(resolve), 400);
		}
	};

	return new Promise(poll);
};
