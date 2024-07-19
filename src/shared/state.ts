interface State {
    serviceWorker: boolean;
    settings: Settings;
}

interface Settings {
    camera: CameraSettings;
    database: DatabaseSettings;
    search: SearchSettings;
}

interface CameraSettings {
    list: boolean[];
    selection: boolean | null;
}

// biome-ignore lint/suspicious/noEmptyInterface: There until dynamic settings are added
interface DatabaseSettings {
}

interface SearchSettings {
    provider: "bookbrainz" | "google" | "isbndb" | "openlibrary" | "worldcat";
    worldcatToken: string | null;
}

export const state: State = {
    serviceWorker: false,
    settings: {
        camera: {
            list: [],
            selection: null,
        },
        database: {},
        search: {
            provider: "openlibrary",
            worldcatToken: null,
        },
    },
};

export const loadState = () => {};

export const saveState = () => {};
