<script lang="ts">
    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";

    import BookViewDesktop from "$lib/components/book/BookViewDesktop.svelte";
    import BookViewMobile from "$lib/components/book/BookViewMobile.svelte";
</script>

<MediaQueryDesktop>
    <BookViewDesktop />
</MediaQueryDesktop>

<MediaQueryMobile>
    <BookViewMobile />
</MediaQueryMobile>
