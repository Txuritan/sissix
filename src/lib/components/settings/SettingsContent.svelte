<script lang="ts">
    import { type Selected } from 'bits-ui';
    import { scrollTo, scrollRef, scrollTop } from 'svelte-scrolling';
    import MediaQueryDesktop from '../MediaQueryDesktop.svelte';

    import { Label } from "$lib/components/ui/label";
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import * as Select from "$lib/components/ui/select";
    import { Separator } from "$lib/components/ui/separator";

    import { getName } from '$lib/camera';
    import { cameras, settingsCameraSelected } from '$lib/state';
    import { errorToast } from '$lib/utils';

    const onSelect = (obj: Selected<unknown> | undefined) => {
        if (obj == undefined) {
            return;
        }

        if (typeof obj.value == "string") {
            $settingsCameraSelected = obj.value;
        } else {
            errorToast("failed camera selection change", "selected returned a value that isnt a string", {
                "returnedType": typeof obj.value,
                "returnedValue": JSON.stringify(obj.value),
            });
        }
    };

    $: selectedDevice = $cameras.find(camera => camera.deviceId == $settingsCameraSelected);
    $: cameraName = selectedDevice != undefined ? getName(selectedDevice.label) ?? "Unknown Device" : "Select preferred camera";
</script>

<div class="flex flex-row min-h-56">
    <MediaQueryDesktop>
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="border-r w-40 py-4 flex flex-col">
            <a use:scrollTo={"camera"} class="text-sm">Camera</a>
            <a use:scrollTo={"database"} class="text-sm">Database</a>
        </div>
    </MediaQueryDesktop>

    <ScrollArea class="flex-grow py-4">
        <section class="ml-6 mb-4">
            <h3 use:scrollRef={"camera"} class="text-xl font-bold mb-2">Camera</h3>

            <Label for="settings-camera-selected" class="text-lg">Preferred Camera</Label>
            <Select.Root onSelectedChange={onSelect} selected={({ value: $settingsCameraSelected, label: undefined })}>
                <Select.Trigger class="w-52" id="settings-camera-selected">
                    <Select.Value placeholder={cameraName} />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        {#each $cameras as camera}
                        <Select.Item value={camera.deviceId}>{getName(camera.label)}</Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </section>

        <Separator class="ml-4 my-4" />

        <section class="ml-6 mb-4">
            <h3 use:scrollRef={"database"} class="text-xl font-bold mb-2">Database</h3>
        </section>
    </ScrollArea>
</div>
