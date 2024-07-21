import type { RecursivePartial } from "./utils";

interface State {
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

const state: State = {
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

export const getState = (): State => {
    return state;
};

export const setState = (state: RecursivePartial<State>) => {};
