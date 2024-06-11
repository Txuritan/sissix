<script lang="ts">
    import * as Drawer from "$lib/components/ui/drawer";

    import BookEditContent from "$lib/components/book/BookEditContent.svelte";

    import { editEntryOpen } from "$lib/state/core";
</script>

<Drawer.Root open={$editEntryOpen} onOpenChange={(state) => { $editEntryOpen = state; }}>
    <Drawer.Content>
        <BookEditContent />
    </Drawer.Content>
</Drawer.Root>
