<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Tabs from "$lib/components/ui/tabs";

    import AddScan from "$lib/components/add/AddScan.svelte";
    import AddSearch from "$lib/components/add/AddSearch.svelte";

    import { addOpen } from "$lib/state";
</script>

<Dialog.Root open={$addOpen} onOpenChange={(state) => { $addOpen = state; }}>
    <Dialog.Content class="pt-0 max-h-[90vh]">
        <h2 class="pt-3 text-lg font-bold">Add Book</h2>

        <Tabs.Root value="search">
            <Tabs.List class="mt-[-0.5rem] grid w-full grid-cols-2">
                <Tabs.Trigger value="search">Search</Tabs.Trigger>
                <Tabs.Trigger value="scan">Scan</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="search">
                <AddSearch />
            </Tabs.Content>
            <Tabs.Content value="scan">
                <AddScan />
            </Tabs.Content>
        </Tabs.Root>
    </Dialog.Content>
</Dialog.Root>
