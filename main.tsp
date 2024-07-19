import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "@typespec/versioning";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.Versioning;

@service({
    title: "Sissix Sync Server",
})
@server("https://example.com/api", "Example Sissix Sync Server")
@versioned(Versions)
namespace Sissix {
    enum Versions {
        v1: "1.0.0",
    }

    @error
    @added(Versions.v1)
    model ValidationError {
        code: "VALIDATION_ERROR";
        message: string;
        details: string[];
    }

    @error
    @added(Versions.v1)
    model NotFoundError {
        code: "NOT_FOUND";
        message: string;
    }

    @error
    @added(Versions.v1)
    model InternalServerError {
        code: "INTERNAL_SERVER_ERROR";
        message: string;
    }

    @added(Versions.v1)
    model Range {
        min: uint32;
        max: uint32;
    }

    @added(Versions.v1)
    enum SettingKeys {
        "camera.selection",
        "search.provider",
        "search.worldcat.token",
    }

    @added(Versions.v1)
    model Setting {
        key: SettingKeys | string;
        value: string | int32 | boolean;
        range?: Range;
        options?: string[];
    }

    @added(Versions.v1)
    model Author {
        id: integer;
    }

    @added(Versions.v1)
    model Publisher {
        id: integer;
    }

    @added(Versions.v1)
    model Series {
        id: integer;
    }

    @added(Versions.v1)
    enum BookType {
        Audiobook,
        Hardcover,
        Digital,
        Paperback,
    }

    @added(Versions.v1)
    scalar BookId extends string;

    @added(Versions.v1)
    model Book {
        id: BookId;

        title: string;
        subtitle?: string;
        type: BookType;
        pages: integer;
        description: string;
        published: utcDateTime;

        isbn10?: string;
        isbn13?: string;
        lcc?: string; // Library of Congress Classification ID
        mds?: string; // Melvil Decimal System ID
        olid?: string; // OpenLibrary ID

        authors?: Author[];
        publishers?: Publisher[];
        series?: Series[];
    }

    @added(Versions.v1)
    scalar UserBookId extends string;

    @added(Versions.v1)
    model UserBook {
        id: UserBookId;
        bookId: BookId;
    }

    @added(Versions.v1)
    scalar BookshelfId extends string;

    @added(Versions.v1)
    model Bookshelf {
        id: BookshelfId;
        books: UserBook[];
    }

    @added(Versions.v1)
    model Database {
        books: Book[];
        bookshelves: Bookshelf[];
        settings: Setting[];
    }

    @route("/sync")
    namespace Sync {
        @added(Versions.v1)
        @get op get(@header Authorization: string): {
            @statusCode statusCode: 200;
            @body database: Database;
        } | {
            @statusCode statusCode: 500;
            @body error: InternalServerError;
        };

        @added(Versions.v1)
        @patch op update(@header Authorization: string, @body database: Database): {
            @statusCode statusCode: 200;
        } | {
            @statusCode statusCode: 500;
            @body error: InternalServerError;
        };
    }
}
