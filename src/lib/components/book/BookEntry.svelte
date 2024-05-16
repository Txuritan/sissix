<script lang="ts">
    import { tap, press } from 'svelte-gestures';

    import { Badge } from "$lib/components/ui/badge";

    import { type FilledBook } from "$lib/models";
    import { editEntry, editEntryOpen, viewEntry, viewEntryOpen } from "$lib/state";

    export let book: FilledBook;

    const onTap = () => {
        $viewEntry = book;
        $viewEntryOpen = true;
    };
    const onPress = () => {
        $editEntry = book;
        $editEntryOpen = true;
    };
</script>

<div use:tap use:press on:tap={onTap} on:press={onPress} class="flex flex-row rounded-md border border-input hover:bg-accent hover:text-accent-foreground p-2">
    <div class="h-24 min-h-24 max-h-24 w-[3.75rem] min-w-[3.75rem] max-w-[3.75rem] aspect-[10/16] overflow-hidden rounded">
        <img class="min-h-24 min-w-[3.75rem] object-cover transition-all" alt={"The cover of " + book.title} src={book.cover}>
    </div>
    <div class="flex flex-col flex-grow justify-center ml-4">
        <h3 class="font-bold text-lg tracking-tight truncate max-w-full">{book.title}</h3>
        <p class="text-muted-foreground text-sm">{book.author.map(a => a.content).join(", ")}</p>
        <div class="flex space-x-1 min-h-5 pt-1">
            {#if book.category != null && book.category.length != 0}
                <Badge>{book.category[0].content}</Badge>
            {/if}
        </div>
    </div>
</div>
