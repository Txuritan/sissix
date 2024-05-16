<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon'
    import { Moon, Sun, Plus, Menu } from '@steeze-ui/tabler-icons'
    import { liveQuery } from "dexie";
    import { toggleMode } from "mode-watcher";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

    import BookEntry from "$lib/components/book/BookEntry.svelte";
    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";

    import DB from "$lib/database";
    import { navOpen } from "$lib/state";
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

    $: books = liveQuery(() => DB.getAllBooks());
</script>

<div class="flex flex-row space-x-2 py-2">
    <MediaQueryMobile>
        <Button variant="outline" size="icon" on:click={() => { $navOpen = true; }}>
            <Icon class="h-[1.2rem] w-[1.2rem]" src={Menu} theme="filled" size="16" />
            <span class="sr-only">Open menu</span>
        </Button>
    </MediaQueryMobile>

    <h2 class="font-bold text-lg leading-8 flex-grow">Library</h2>

    <Button variant="outline" size="icon">
        <Icon src={Plus} theme="filled" class="h-[1.2rem] w-[1.2rem]" size="16" />
        <span class="sr-only">Add book</span>
    </Button>

    <Button on:click={toggleMode} variant="outline" size="icon">
        <Icon src={Moon} theme="filled" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon src={Sun} theme="filled" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
    </Button>

    <MediaQueryDesktop>
        <Input type="text" placeholder="search" class="max-w-60" />
    </MediaQueryDesktop>
</div>

<MediaQueryMobile>
    <div class="flex flex-row py-2">
        <Input type="text" placeholder="search" class="w-full" />
    </div>
</MediaQueryMobile>

<ScrollArea class="h-full">
    <div class="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-2" role="list">
    {#if $books}
        {#each $books as book (book.id)}
            <BookEntry book={book} />
        {/each}
    {/if}
    </div>
</ScrollArea>
