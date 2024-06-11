import { writableLocal } from "$lib/storage";

export const cameraSelected = writableLocal<string | null>("sissix.settings.camera.selected", null);

export const searchProvider = writableLocal<string | null>("sissix.settings.search.provider", "openlibrary");
export const searchWorldcatKey = writableLocal<string | null>("sissix.settings.search.worldcatKey", null);
