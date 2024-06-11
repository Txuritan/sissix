<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import * as ZXing from "@zxing/library";

    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";

    import { addOpen, importOpen, importIsbn, cameras, settingsCameraSelected } from "$lib/state";
    import { errorToast } from "$lib/utils";

    const codeReader = new ZXing.BrowserMultiFormatReader();

    const selectedDevice = $cameras.find(camera => camera.deviceId == $settingsCameraSelected);

    onMount(async () => {
        if (selectedDevice != undefined) {
            await codeReader.decodeFromVideoDevice(selectedDevice.deviceId, "camera-preview", (result, err) => {
                if (result) {
                    $addOpen = false;
                    $importOpen = true;
                    $importIsbn = result.getText();
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    errorToast("failed to scan feed", err);
                }
            });
        } else {
            errorToast("no camera selected", "user has not selected a primary camera");
        }
    });

    onDestroy(async () => {
        codeReader.reset();
    });
</script>

<div>
    <MediaQueryDesktop>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video id="camera-preview" class="rounded border" width="800" height="800" autoplay muted></video>
    </MediaQueryDesktop>
    <MediaQueryMobile>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video id="camera-preview" class="rounded border" width="400" height="400" autoplay muted></video>
    </MediaQueryMobile>
</div>
