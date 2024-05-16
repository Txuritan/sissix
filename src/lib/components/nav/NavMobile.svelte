<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";

    import NavContents from "$lib/components/nav/NavContents.svelte";

    import { navOpen } from "$lib/state";
</script>

<Sheet.Root open={$navOpen} onOpenChange={(state) => { $navOpen = state; }}>
    <Sheet.Content side="left" class="p-0">
        <NavContents />
    </Sheet.Content>
</Sheet.Root>
