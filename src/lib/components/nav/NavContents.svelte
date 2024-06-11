<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Book, Bookmark, ChartAreaLine, Message, Settings } from '@steeze-ui/tabler-icons';

    import { Button } from "$lib/components/ui/button";

    import NavButton from "$lib/components/nav/NavButton.svelte";

    import { navOpen, settingsOpen } from "$lib/state";
    import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
</script>

<ScrollArea>
    <div class="space-y-2 py-2 h-full">
        <div class="px-2 flex justify-start">
            <Button variant="outline" size="icon" on:click={() => { $navOpen = false; $settingsOpen = true; }}>
                <Icon class="h-[1.2rem] w-[1.2rem]" src={Settings} theme="filled" size="16" />
                <span class="sr-only">Open settings</span>
            </Button>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-2 px-2">
            <NavButton to="/" color="orange" count={28}><svelte:fragment slot="icon"><Icon src={Book} theme="filled" size="14" /></svelte:fragment> Library</NavButton>
            <NavButton to="/" color="red" count={14}><svelte:fragment slot="icon"><Icon src={Bookmark} theme="filled" size="14" /></svelte:fragment> Wish List</NavButton>
            <NavButton to="/" color="green"><svelte:fragment slot="icon"><Icon src={ChartAreaLine} theme="filled" size="14" /></svelte:fragment> Statistics</NavButton>
            <NavButton to="/" color="blue"><svelte:fragment slot="icon"><Icon src={Message} theme="filled" size="14" /></svelte:fragment> Quotes</NavButton>
        </div>

        <div class="grid grid-cols-3 grid-rows-1 gap-2 px-2"></div>
    </div>
</ScrollArea>
