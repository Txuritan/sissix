<script lang="ts">
    import dayjs from "dayjs";

    import { viewEntry } from "$lib/state/core";
</script>

<div class="h-48 min-h-48 max-h-48 w-[7.5rem] min-w-[7.5rem] max-w-[7.5rem] aspect-[10/16] overflow-hidden rounded">
    <img class="min-h-48 min-w-[7.5rem] object-cover transition-all" alt={"The cover of " + $viewEntry.title} src={$viewEntry.cover}>
</div>

<div class="flex flex-col items-center">
    <h2 class="text-lg font-bold">{$viewEntry.title}</h2>
    {#if $viewEntry.subtitle != null && $viewEntry.subtitle.length != 0}<h2 class="font-bold">{$viewEntry.subtitle}</h2>{/if}
    <p class="text-muted-foreground">{$viewEntry.author.map(e => e.content).join(", ")}</p>
    <p class="text-muted-foreground">{$viewEntry.publisher.map(e => e.content).join(", ")}</p>
</div>

<div class="flex space-x-2 min-w-40 justify-center">
    <div class="flex flex-col text-sm items-center">
        <p class="text-muted-foreground">Year</p>
        <p>{dayjs($viewEntry.published).format("YYYY")}</p>
    </div>
    <div class="flex flex-col text-sm items-center">
        <p class="text-muted-foreground">Pages</p>
        <p>{$viewEntry.pages}</p>
    </div>
</div>
