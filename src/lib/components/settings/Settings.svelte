<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import SettingsContent from "$lib/components/settings/SettingsContent.svelte";

    import { settingsOpen } from "$lib/state/core";
</script>

<Dialog.Root open={$settingsOpen} onOpenChange={(state) => { $settingsOpen = state; }}>
    <Dialog.Content class="py-0 max-h-[90vh] min-h-[70vh] border-x-0 md:border-x">
        <SettingsContent />
    </Dialog.Content>
</Dialog.Root>
