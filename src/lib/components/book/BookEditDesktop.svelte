<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import BookEditContent from "$lib/components/book/BookEditContent.svelte";

    import { editEntryOpen } from "$lib/state";
</script>

<Dialog.Root open={$editEntryOpen} onOpenChange={(state) => { $editEntryOpen = state; }}>
    <Dialog.Content>
        <BookEditContent />
    </Dialog.Content>
</Dialog.Root>
