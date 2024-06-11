<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { importOpen, importIsbn } from "$lib/state";
</script>

<Dialog.Root open={$importOpen} onOpenChange={(state) => { $importOpen = state; }}>
    <Dialog.Content class="pt-0 max-h-[90vh]">
        {$importIsbn}
    </Dialog.Content>
</Dialog.Root>
