import * as ZXing from "@zxing/library";

import { wrapAsyncError } from "$lib/utils";

const codeReader = new ZXing.BrowserMultiFormatReader();

export const getDevices = () => {
    return wrapAsyncError("unable to get list of cameras", async () => await codeReader.listVideoInputDevices());
};

export const getName = (label: string) => {
    let clean = label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, '');
    return clean || label || null;
};

const ensureAccess = async () => {
    return await wrapAsyncError("unable to ensure camera access", async () => {
        let access = await navigator.mediaDevices.getUserMedia({ video: true });
        for (let stream of access.getVideoTracks()) {
            stream.stop();
        }

        // https://stackoverflow.com/a/69468263
        // Firefox requires getting media devices after stopping all streams
        await navigator.mediaDevices.getUserMedia({ video: true });
    });
};

export const stopAll = async () => {
    let access = await navigator.mediaDevices.getUserMedia({ video: true });
    for (let stream of access.getVideoTracks()) {
        stream.stop();
    }
};

export class Camera {
    id: string;
    name: string | null;

    constructor(id: string, name: string | null) {
        this.id = id;
        this.name = name;
    }

    public static async getCameras() {
        await ensureAccess();

        return (await navigator.mediaDevices.enumerateDevices())
            .filter(d => d.kind === 'videoinput')
            .map(d => new Camera(d.deviceId, getName(d.label)));
    };

    public async start(camera: Camera) {
        return await wrapAsyncError("unable to start selected camera", async () => {
            return await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: camera.id,
                },
            });
        });
    };

    public async stop(stream: MediaStream) {
        for (let track of stream.getVideoTracks()) {
            track.stop();
        }
    };
}

export class Scanner {}
