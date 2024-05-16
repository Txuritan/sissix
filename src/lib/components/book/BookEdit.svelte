<script lang="ts">
    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";

    import BookEditDesktop from "$lib/components/book/BookEditDesktop.svelte";
    import BookEditMobile from "$lib/components/book/BookEditMobile.svelte";
</script>

<MediaQueryDesktop>
    <BookEditDesktop />
</MediaQueryDesktop>

<MediaQueryMobile>
    <BookEditMobile />
</MediaQueryMobile>
