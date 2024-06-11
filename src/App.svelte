<script lang="ts">
    import "./app.css";

    import { ModeWatcher } from "mode-watcher";
    import { onMount } from "svelte";
    import { Router, Route } from "svelte-routing";

    import { Toaster } from "$lib/components/ui/sonner";

    import Add from "$lib/components/add/Add.svelte";
    import BookEdit from "$lib/components/book/BookEdit.svelte";
    import BookView from "$lib/components/book/BookView.svelte";
    import Import from "$lib/components/add/Import.svelte";
    import Nav from "$lib/components/nav/Nav.svelte";
    import Settings from "$lib/components/settings/Settings.svelte";

    import * as Camera from "$lib/camera";
    import DB from "$lib/database";
    import { cameras } from "$lib/state";

    import LibraryBooks from "$routes/LibraryBooks.svelte";
    import LibraryBookshelves from "$routes/LibraryBookshelves.svelte";
    import LibraryWishlist from "$routes/LibraryWishlist.svelte";
    import Statistics from "$routes/Statistics.svelte";

    export let url = "/";

    // TODO: add a better say to set this
    let basepath = "/"
    if (import.meta.env.PROD) {
        basepath = "/sissix/"
    }

    onMount(async () => {
        await DB.persist();

        (await navigator.mediaDevices.getUserMedia({ audio: false, video: true })).getTracks().forEach(track => track.stop());

        $cameras = await Camera.getDevices() ?? [];
    });
</script>

<div class="flex h-screen font-sans">
    <ModeWatcher />
    <Toaster />

    <Add />
    <BookEdit />
    <BookView />
    <Import />

    <Router {url} {basepath}>
        <Nav />

        <Settings />

        <main class="flex flex-col flex-grow px-2 max-h-screen">
            <Route path="/">
                <LibraryBooks />
            </Route>
            <Route path="/bookshelves">
                <LibraryBookshelves />
            </Route>
            <Route path="/wishlist">
                <LibraryWishlist />
            </Route>
            <Route path="/wishlist">
                <LibraryWishlist />
            </Route>
            <Route path="/statistics">
                <Statistics />
            </Route>
        </main>
    </Router>
</div>
