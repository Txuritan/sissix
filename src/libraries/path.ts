/**
MIT License

Copyright (c) 2015 Thomas Roch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

type arrayFormat = "none" | "brackets" | "index";
type booleanFormat = "none" | "string" | "unicode" | "empty-true";
type nullFormat = "default" | "string" | "hidden";

interface IOptions {
	arrayFormat?: arrayFormat;
	booleanFormat?: booleanFormat;
	nullFormat?: nullFormat;
}

interface IFinalOptions {
	arrayFormat: arrayFormat;
	booleanFormat: booleanFormat;
	nullFormat: nullFormat;
}

const makeOptions = (opts: IOptions = {}): IFinalOptions => ({
	arrayFormat: opts.arrayFormat || "none",
	booleanFormat: opts.booleanFormat || "none",
	nullFormat: opts.nullFormat || "default",
});

const encodeValue = (value: any): string => encodeURIComponent(value);

const decodeValue = (value: string): string =>
	decodeURIComponent(value.replace(/\+/g, " "));

const encodeBoolean = (
	name: string,
	value: boolean,
	opts: IFinalOptions,
): string => {
	if (opts.booleanFormat === "empty-true" && value) {
		return name;
	}

	let encodedValue: string;

	if (opts.booleanFormat === "unicode") {
		encodedValue = value ? "✓" : "✗";
	} else {
		encodedValue = value.toString();
	}

	return `${name}=${encodedValue}`;
};

const encodeNull = (name: string, opts: IFinalOptions): string => {
	if (opts.nullFormat === "hidden") {
		return "";
	}

	if (opts.nullFormat === "string") {
		return `${name}=null`;
	}

	return name;
};

type nameEncoder = (val: string, index: number) => string;

const getNameEncoder = (opts: IFinalOptions): nameEncoder => {
	if (opts.arrayFormat === "index") {
		return (name: string, index: number): string => `${name}[${index}]`;
	}

	if (opts.arrayFormat === "brackets") {
		return (name: string): string => `${name}[]`;
	}

	return (name: string): string => name;
};

const encodeArray = (name: string, arr: any[], opts: IFinalOptions): string => {
	const encodeName = getNameEncoder(opts);

	return arr
		.map((val, index) => `${encodeName(name, index)}=${encodeValue(val)}`)
		.join("&");
};

const encode = (name: string, value: any, opts: IFinalOptions): string => {
	const encodedName = encodeValue(name);

	if (value === null) {
		return encodeNull(encodedName, opts);
	}

	if (typeof value === "boolean") {
		return encodeBoolean(encodedName, value, opts);
	}

	if (Array.isArray(value)) {
		return encodeArray(encodedName, value, opts);
	}

	return `${encodedName}=${encodeValue(value)}`;
};

const decode = (value: any, opts: IFinalOptions): boolean | string | null => {
	if (value === undefined) {
		return opts.booleanFormat === "empty-true" ? true : null;
	}

	if (opts.booleanFormat === "string") {
		if (value === "true") {
			return true;
		}
		if (value === "false") {
			return false;
		}
	}

	if (opts.nullFormat === "string") {
		if (value === "null") {
			return null;
		}
	}

	const decodedValue = decodeValue(value);

	if (opts.booleanFormat === "unicode") {
		if (decodedValue === "✓") {
			return true;
		}
		if (decodedValue === "✗") {
			return false;
		}
	}

	return decodedValue;
};

const getSearch = (path: string): string => {
	const pos = path.indexOf("?");

	if (pos === -1) {
		return path;
	}

	return path.slice(pos + 1);
};

const isSerializable = (val: any): boolean => val !== undefined;

interface IParsedName {
	hasBrackets: boolean;
	name: string;
}

const parseName = (name: string): IParsedName => {
	const bracketPosition = name.indexOf("[");
	const hasBrackets = bracketPosition !== -1;

	return {
		hasBrackets,
		name: hasBrackets ? name.slice(0, bracketPosition) : name,
	};
};

type SearchParams = Record<
	string,
	string | boolean | null | Array<string | boolean | null> | undefined
>;

/**
 * Parse a querystring and return an object of parameters
 */
const parseQueryParams = <T extends Record<string, any> = SearchParams>(
	path: string,
	opts?: IOptions,
): T => {
	const options = makeOptions(opts);

	return getSearch(path)
		.split("&")
		.reduce<Record<string, any>>((params, param) => {
			const [rawName, value] = param.split("=");
			const { hasBrackets, name } = parseName(rawName);
			const decodedName = decodeValue(name);
			const currentValue = params[name];
			const decodedValue = decode(value, options);

			if (currentValue === undefined) {
				params[decodedName] = hasBrackets ? [decodedValue] : decodedValue;
			} else {
				params[decodedName] = (
					Array.isArray(currentValue) ? currentValue : [currentValue]
				).concat(decodedValue);
			}

			return params;
		}, {}) as T;
};

/**
 * Build a querystring from an object of parameters
 */
const buildQueryParams = <T extends Record<string, any> = SearchParams>(
	params: T,
	opts?: IOptions,
): string => {
	const options = makeOptions(opts);

	return Object.keys(params)
		.filter((paramName) => isSerializable(params[paramName]))
		.map((paramName) => encode(paramName, params[paramName], options))
		.filter(Boolean)
		.join("&");
};

/**
 * We encode using encodeURIComponent but we want to
 * preserver certain characters which are commonly used
 * (sub delimiters and ':')
 *
 * https://www.ietf.org/rfc/rfc3986.txt
 *
 * reserved    = gen-delims / sub-delims
 *
 * gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
 *
 * sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
              / "*" / "+" / "," / ";" / "="
 */

const excludeSubDelimiters = /[^!$'()*+,;|:]/g;

export type URLParamsEncodingType =
	| "default"
	| "uri"
	| "uriComponent"
	| "none"
	| "legacy";

const encodeURIComponentExcludingSubDelims = (segment: string): string =>
	segment.replace(excludeSubDelimiters, (match) => encodeURIComponent(match));

const encodingMethods: Record<
	URLParamsEncodingType,
	(param: string) => string
> = {
	default: encodeURIComponentExcludingSubDelims,
	uri: encodeURI,
	uriComponent: encodeURIComponent,
	none: (val) => val,
	legacy: encodeURI,
};

const decodingMethods: Record<
	URLParamsEncodingType,
	(param: string) => string
> = {
	default: decodeURIComponent,
	uri: decodeURI,
	uriComponent: decodeURIComponent,
	none: (val) => val,
	legacy: decodeURIComponent,
};

const encodeParam = (
	param: string | number | boolean,
	encoding: URLParamsEncodingType,
	isSpatParam: boolean,
): string => {
	const encoder =
		encodingMethods[encoding] || encodeURIComponentExcludingSubDelims;

	if (isSpatParam) {
		return String(param).split("/").map(encoder).join("/");
	}

	return encoder(String(param));
};

const decodeParam = (param: string, encoding: URLParamsEncodingType): string =>
	(decodingMethods[encoding] || decodeURIComponent)(param);

const defaultOrConstrained = (match: string): string =>
	`(${match ? match.replace(/(^<|>$)/g, "") : "[a-zA-Z0-9-_.~%':|=+\\*@$]+"})`;

type RegExpFactory = (match: any) => RegExp;

interface IRule {
	/* The name of the rule */
	name: string;
	/* The regular expression used to find a token in a path definition */
	pattern: RegExp;
	/* The derived regular expression to match a path */
	regex?: RegExp | RegExpFactory;
}

const rules: IRule[] = [
	{
		name: "url-parameter",
		pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
		regex: (match: RegExpMatchArray) =>
			new RegExp(defaultOrConstrained(match[2])),
	},
	{
		name: "url-parameter-splat",
		pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
		regex: /([^?]*)/,
	},
	{
		name: "url-parameter-matrix",
		pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
		regex: (match: RegExpMatchArray) =>
			new RegExp(`;${match[1]}=${defaultOrConstrained(match[2])}`),
	},
	{
		name: "query-parameter",
		pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
	},
	{
		name: "delimiter",
		pattern: /^(\/|\?)/,
		regex: (match: RegExpMatchArray) => new RegExp(`\\${match[0]}`),
	},
	{
		name: "sub-delimiter",
		pattern: /^(!|&|-|_|\.|;)/,
		regex: (match: RegExpMatchArray) => new RegExp(match[0]),
	},
	{
		name: "fragment",
		pattern: /^([0-9a-zA-Z]+)/,
		regex: (match: RegExpMatchArray) => new RegExp(match[0]),
	},
];

interface Token {
	type: string;
	match: string;
	val: any;
	otherVal: any;
	regex?: RegExp;
}

const tokenise = (str: string, tokens: Token[] = []): Token[] => {
	// Look for a matching rule
	const matched = rules.some((rule) => {
		const match = str.match(rule.pattern);
		if (!match) {
			return false;
		}

		tokens.push({
			type: rule.name,
			match: match[0],
			val: match.slice(1, 2),
			otherVal: match.slice(2),
			regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex,
		});

		if (match[0].length < str.length) {
			tokens = tokenise(str.substr(match[0].length), tokens);
		}
		return true;
	});

	// If no rules matched, throw an error (possible malformed path)
	if (!matched) {
		throw new Error(`Could not parse path '${str}'`);
	}

	return tokens;
};

const exists = (val: any) => val !== undefined && val !== null;

const optTrailingSlash = (source: string, strictTrailingSlash: boolean) => {
	if (strictTrailingSlash) {
		return source;
	}

	if (source === "\\/") {
		return source;
	}

	return `${source.replace(/\\\/$/, "")}(?:\\/)?`;
};

const upToDelimiter = (source: string, delimiter?: boolean) => {
	if (!delimiter) {
		return source;
	}

	return /(\/)$/.test(source) ? source : `${source}(\\/|\\?|\\.|;|$)`;
};

const appendQueryParam = (
	params: Record<string, any>,
	param: string,
	val = "",
) => {
	const existingVal = params[param];

	if (existingVal === undefined) {
		params[param] = val;
	} else {
		params[param] = Array.isArray(existingVal)
			? existingVal.concat(val)
			: [existingVal, val];
	}

	return params;
};

export interface PathOptions {
	/**
	 * Query parameters buiding and matching options, see
	 * https://github.com/troch/search-params#options
	 */
	queryParams?: IOptions;
	/**
	 * Specifies the method used to encode URL parameters:
	 *   - `'default': `encodeURIComponent` and `decodeURIComponent`
	 *      are used but some characters to encode and decode URL parameters,
	 *      but some characters are preserved when encoding
	 *      (sub-delimiters: `+`, `:`, `'`, `!`, `,`, `;`, `'*'`).
	 *   - `'uriComponent'`: use `encodeURIComponent` and `decodeURIComponent`
	 *      for encoding and decoding URL parameters.
	 *   - `'uri'`: use `encodeURI` and `decodeURI for encoding amd decoding
	 *      URL parameters.
	 *   - `'none'`: no encoding or decoding is performed
	 *   - `'legacy'`: the approach for version 5.x and below (not recoomended)
	 */
	urlParamsEncoding?: URLParamsEncodingType;
}

export interface InternalPathOptions {
	queryParams?: IOptions;
	urlParamsEncoding: URLParamsEncodingType;
}

const defaultOptions: InternalPathOptions = {
	urlParamsEncoding: "default",
};

export interface PathPartialTestOptions extends PathOptions {
	caseSensitive?: boolean;
	delimited?: boolean;
}

export interface PathTestOptions extends PathOptions {
	caseSensitive?: boolean;
	strictTrailingSlash?: boolean;
}

export interface PathBuildOptions extends PathOptions {
	ignoreConstraints?: boolean;
	ignoreSearch?: boolean;
}

export type TestMatch<T extends Record<string, any> = Record<string, any>> =
	T | null;

export class Path<T extends Record<string, any> = Record<string, any>> {
	public static createPath<T extends Record<string, any> = Record<string, any>>(
		path: string,
		options?: PathOptions,
	) {
		return new Path<T>(path, options);
	}

	public path: string;
	public tokens: Token[];
	public hasUrlParams: boolean;
	public hasSpatParam: boolean;
	public hasMatrixParams: boolean;
	public hasQueryParams: boolean;
	public options: InternalPathOptions;
	public spatParams: string[];
	public urlParams: string[];
	public queryParams: string[];
	public params: string[];
	public source: string;

	constructor(path: string, options?: PathOptions) {
		if (!path) {
			throw new Error("Missing path in Path constructor");
		}
		this.path = path;
		this.options = {
			...defaultOptions,
			...options,
		};
		this.tokens = tokenise(path);

		this.hasUrlParams =
			this.tokens.filter((t) => /^url-parameter/.test(t.type)).length > 0;
		this.hasSpatParam =
			this.tokens.filter((t) => /splat$/.test(t.type)).length > 0;
		this.hasMatrixParams =
			this.tokens.filter((t) => /matrix$/.test(t.type)).length > 0;
		this.hasQueryParams =
			this.tokens.filter((t) => /^query-parameter/.test(t.type)).length > 0;
		// Extract named parameters from tokens
		this.spatParams = this.getParams("url-parameter-splat");
		this.urlParams = this.getParams(/^url-parameter/);
		// Query params
		this.queryParams = this.getParams("query-parameter");
		// All params
		this.params = this.urlParams.concat(this.queryParams);
		// Check if hasQueryParams
		// Regular expressions for url part only (full and partial match)
		this.source = this.tokens
			.filter((t) => t.regex !== undefined)
			.map((t) => t.regex!.source)
			.join("");
	}

	public isQueryParam(name: string): boolean {
		return this.queryParams.indexOf(name) !== -1;
	}

	public isSpatParam(name: string): boolean {
		return this.spatParams.indexOf(name) !== -1;
	}

	public test(path: string, opts?: PathTestOptions): TestMatch<T> {
		const options = {
			caseSensitive: false,
			strictTrailingSlash: false,
			...this.options,
			...opts,
		} as const;
		// trailingSlash: falsy => non optional, truthy => optional
		const source = optTrailingSlash(this.source, options.strictTrailingSlash);
		// Check if exact match
		const match = this.urlTest(
			path,
			source + (this.hasQueryParams ? "(\\?.*$|$)" : "$"),
			options.caseSensitive,
			options.urlParamsEncoding,
		);
		// If no match, or no query params, no need to go further
		if (!match || !this.hasQueryParams) {
			return match;
		}
		// Extract query params
		const queryParams = parseQueryParams(path, options.queryParams);
		const unexpectedQueryParams = Object.keys(queryParams).filter(
			(p) => !this.isQueryParam(p),
		);

		if (unexpectedQueryParams.length === 0) {
			// Extend url match
			Object.keys(queryParams).forEach(
				// @ts-ignore
				(p) => (match[p] = (queryParams as any)[p]),
			);

			return match;
		}

		return null;
	}

	public partialTest(
		path: string,
		opts?: PathPartialTestOptions,
	): TestMatch<T> {
		const options = {
			caseSensitive: false,
			delimited: true,
			...this.options,
			...opts,
		} as const;
		// Check if partial match (start of given path matches regex)
		// trailingSlash: falsy => non optional, truthy => optional
		const source = upToDelimiter(this.source, options.delimited);
		const match = this.urlTest(
			path,
			source,
			options.caseSensitive,
			options.urlParamsEncoding,
		);

		if (!match) {
			return match;
		}

		if (!this.hasQueryParams) {
			return match;
		}

		const queryParams = parseQueryParams(path, options.queryParams);

		Object.keys(queryParams)
			.filter((p) => this.isQueryParam(p))
			.forEach((p) => appendQueryParam(match, p, (queryParams as any)[p]));

		return match;
	}

	public build(params: T = {} as T, opts?: PathBuildOptions): string {
		const options = {
			ignoreConstraints: false,
			ignoreSearch: false,
			queryParams: {},
			...this.options,
			...opts,
		} as const;
		const encodedUrlParams = Object.keys(params)
			.filter((p) => !this.isQueryParam(p))
			.reduce<Record<string, any>>((acc, key) => {
				if (!exists(params[key])) {
					return acc;
				}

				const val = params[key];
				const isSpatParam = this.isSpatParam(key);

				if (typeof val === "boolean") {
					acc[key] = val;
				} else if (Array.isArray(val)) {
					acc[key] = val.map((v) =>
						encodeParam(v, options.urlParamsEncoding, isSpatParam),
					);
				} else {
					acc[key] = encodeParam(val, options.urlParamsEncoding, isSpatParam);
				}

				return acc;
			}, {});

		// Check all params are provided (not search parameters which are optional)
		if (this.urlParams.some((p) => !exists(params[p]))) {
			const missingParameters = this.urlParams.filter(
				(p) => !exists(params[p]),
			);
			throw new Error(
				`Cannot build path: '${this.path}' requires missing parameters { ${missingParameters.join(", ")} }`,
			);
		}

		// Check constraints
		if (!options.ignoreConstraints) {
			const constraintsPassed = this.tokens
				.filter((t) => /^url-parameter/.test(t.type) && !/-splat$/.test(t.type))
				.every((t) =>
					new RegExp(`^${defaultOrConstrained(t.otherVal[0])}$`).test(
						encodedUrlParams[t.val],
					),
				);

			if (!constraintsPassed) {
				throw new Error(
					`Some parameters of '${this.path}' are of invalid format`,
				);
			}
		}

		const base = this.tokens
			.filter((t) => /^query-parameter/.test(t.type) === false)
			.map((t) => {
				if (t.type === "url-parameter-matrix") {
					return `;${t.val}=${encodedUrlParams[t.val[0]]}`;
				}

				return /^url-parameter/.test(t.type)
					? encodedUrlParams[t.val[0]]
					: t.match;
			})
			.join("");

		if (options.ignoreSearch) {
			return base;
		}

		const searchParams = this.queryParams
			.filter((p) => Object.keys(params).indexOf(p) !== -1)
			.reduce<Record<string, any>>((sparams, paramName) => {
				sparams[paramName] = params[paramName];
				return sparams;
			}, {});
		const searchPart = buildQueryParams(searchParams, options.queryParams);

		return searchPart ? `${base}?${searchPart}` : base;
	}

	private getParams(type: string | RegExp): string[] {
		const predicate =
			type instanceof RegExp
				? (t: Token) => type.test(t.type)
				: (t: Token) => t.type === type;

		return this.tokens.filter(predicate).map((t) => t.val[0]);
	}

	private urlTest(
		path: string,
		source: string,
		caseSensitive: boolean,
		urlParamsEncoding: URLParamsEncodingType,
	): TestMatch<T> {
		const regex = new RegExp(`^${source}`, caseSensitive ? "" : "i");
		const match = path.match(regex);
		if (!match) {
			return null;
		}
		if (!this.urlParams.length) {
			return {} as T;
		}
		// Reduce named params to key-value pairs
		return match
			.slice(1, this.urlParams.length + 1)
			.reduce<Record<string, any>>((params, m, i) => {
				params[this.urlParams[i]] = decodeParam(m, urlParamsEncoding);
				return params;
			}, {}) as T;
	}
}

export default Path;
