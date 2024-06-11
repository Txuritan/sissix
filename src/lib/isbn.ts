abstract class Provider {
    abstract search(isbn: string): string;
    abstract direct(isbn: string): string;
}

class ProviderBookBrainz extends Provider {
    private base = "https://api.test.bookbrainz.org";

    search = (isbn: string): string => { throw new Error("Method not implemented."); };

    direct = (isbn: string): string => { throw new Error("Method not implemented."); };
}

class ProviderGoogle extends Provider {
    private base = "https://www.googleapis.com";

    search = (isbn: string): string => { throw new Error("Method not implemented."); };

    direct = (isbn: string): string => { throw new Error("Method not implemented."); };
}

class ProviderIsbnDB extends Provider {
    private base = "https://api2.isbndb.com";

    search = (isbn: string): string => { throw new Error("Method not implemented."); };

    direct = (isbn: string): string => { throw new Error("Method not implemented."); };
}

class ProviderOpenLibrary extends Provider {
    private base = "https://openlibrary.org";

    search = (isbn: string): string => { throw new Error("Method not implemented."); };

    direct = (isbn: string): string => { throw new Error("Method not implemented."); };
}

class ProviderWorldcat extends Provider {
    private base = "http://xisbn.worldcat.org";

    search = (isbn: string): string => { throw new Error("Method not implemented."); };

    direct = (isbn: string): string => { throw new Error("Method not implemented."); };
}

const PROVIDER_BOOKBRAINZ = new ProviderBookBrainz();
const PROVIDER_GOOGLE = new ProviderGoogle();
const PROVIDER_ISBNDB = new ProviderIsbnDB();
const PROVIDER_OPEN_LIBRARY = new ProviderOpenLibrary();
const PROVIDER_WORLDCAT = new ProviderWorldcat();

const MAP: { [key: string]: Provider } = {
    "bookbrainz": PROVIDER_BOOKBRAINZ,
    "google": PROVIDER_GOOGLE,
    "isbndb": PROVIDER_ISBNDB,
    "openlibrary": PROVIDER_OPEN_LIBRARY,
    "worldcat": PROVIDER_WORLDCAT,
};

export const search = () => {};

export const direct = (isbn: string) => {};
