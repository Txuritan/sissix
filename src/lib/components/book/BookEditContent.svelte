<script lang="ts">
    import { editEntry } from "$lib/state";
</script>

<div class="h-24 min-h-24 max-h-24 w-[3.75rem] min-w-[3.75rem] max-w-[3.75rem] aspect-[10/16] overflow-hidden rounded">
    <img class="min-h-24 min-w-[3.75rem] object-cover transition-all" alt={"The cover of " + $editEntry.title} src={$editEntry.cover}>
</div>
