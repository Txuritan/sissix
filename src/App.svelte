<script lang="ts">
    import "./app.css";

    import { ModeWatcher } from "mode-watcher";
    import { Router, Route } from "svelte-routing";

    import Nav from "$lib/components/nav/Nav.svelte";

    import Library from "./routes/Library.svelte";
    import Statistics from "./routes/Statistics.svelte";
    import Wishlist from "./routes/Wishlist.svelte";

    export let url = "";
</script>

<div class="flex h-screen">
    <ModeWatcher />

    <Router {url}>
        <Nav />

        <main class="flex flex-col flex-grow px-2 max-h-screen">
            <Route path="/">
                <Library />
            </Route>
            <Route path="/statistics">
                <Statistics />
            </Route>
            <Route path="/wishlist">
                <Wishlist />
            </Route>
        </main>
    </Router>
</div>
