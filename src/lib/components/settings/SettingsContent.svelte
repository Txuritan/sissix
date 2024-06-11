<script lang="ts">
    import { type Selected } from 'bits-ui';
    import { scrollTo, scrollRef, scrollTop } from 'svelte-scrolling';
    import MediaQueryDesktop from '../MediaQueryDesktop.svelte';

    import { Label } from "$lib/components/ui/label";
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import * as Select from "$lib/components/ui/select";
    import { Separator } from "$lib/components/ui/separator";

    import { getName } from '$lib/camera';
    import { cameras } from '$lib/state/core';
    import { cameraSelected, searchProvider } from '$lib/state/settings';
    import { errorToast } from '$lib/utils';

    const wrapSelected = (inner: (value: string) => void) => {
        return (obj: Selected<unknown> | undefined) => {
            if (obj == undefined) {
                return;
            }

            if (typeof obj.value == "string") {
                inner(obj.value);
            } else {
                errorToast("selected returned a value that isnt a string", {
                    "returnedType": typeof obj.value,
                    "returnedValue": JSON.stringify(obj.value),
                });
            }
        };
    };

    const onCameraSelect = wrapSelected((value) => {
        $cameraSelected = value;
    });

    const onProviderSelect = wrapSelected((value) => {
        $searchProvider = value;
    });

    $: selectedDevice = $cameras.find(camera => camera.deviceId == $cameraSelected);
    $: cameraName = selectedDevice != undefined ? getName(selectedDevice.label) ?? "Unknown Device" : "Select preferred camera";
</script>

<div class="flex flex-row min-h-56">
    <MediaQueryDesktop>
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="border-r w-40 py-4 flex flex-col">
            <a use:scrollTo={"camera"} class="text-sm py-1">Camera</a>
            <a use:scrollTo={"database"} class="text-sm py-1">Database</a>
            <a use:scrollTo={"search"} class="text-sm py-1">Search</a>
        </div>
    </MediaQueryDesktop>

    <ScrollArea class="flex-grow py-4">
        <section class="ml-6 mb-4">
            <h3 use:scrollRef={"camera"} class="text-xl font-bold mb-2">Camera</h3>

            <Label for="settings-camera-selected" class="text-lg">Preferred Camera</Label>
            <Select.Root onSelectedChange={onCameraSelect} selected={({ value: $cameraSelected, label: undefined })}>
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

        <Separator class="ml-4 my-4" />

        <section class="ml-6 mb-4">
            <h3 use:scrollRef={"search"} class="text-xl font-bold mb-2">Search</h3>

            <Label for="settings-search-provider" class="text-lg">Search Provider</Label>
            <Select.Root onSelectedChange={onProviderSelect} selected={({ value: $searchProvider, label: undefined })}>
                <Select.Trigger class="w-52" id="settings-search-provider">
                    <Select.Value placeholder="OpenLibrary" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Item value="bookbrainz">BookBrainz</Select.Item>
                        <Select.Item value="google">Google</Select.Item>
                        <Select.Item value="isbndb">IsbnDB</Select.Item>
                        <Select.Item value="openlibrary">OpenLibrary</Select.Item>
                        <Select.Item value="worldcat">WorldCat</Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </section>
    </ScrollArea>
</div>
