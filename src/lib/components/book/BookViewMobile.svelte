<script lang="ts">
    import * as Drawer from "$lib/components/ui/drawer";

    import BookViewContent from "$lib/components/book/BookViewContent.svelte";

    import { viewEntryOpen } from "$lib/state";
</script>

<Drawer.Root open={$viewEntryOpen} onOpenChange={(state) => { $viewEntryOpen = state; }}>
    <Drawer.Content class="px-6 flex flex-col items-center gap-4 mb-4">
        <BookViewContent />
    </Drawer.Content>
</Drawer.Root>
