<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import BookViewContent from "$lib/components/book/BookViewContent.svelte";

    import { viewEntryOpen } from "$lib/state/core";
</script>

<Dialog.Root open={$viewEntryOpen} onOpenChange={(state) => { $viewEntryOpen = state; }}>
    <Dialog.Content class="flex flex-col items-center">
        <BookViewContent />
    </Dialog.Content>
</Dialog.Root>
