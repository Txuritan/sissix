<script lang="ts">
    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";
    import NavDesktop from "$lib/components/nav/NavDesktop.svelte";
    import NavMobile from "$lib/components/nav/NavMobile.svelte";
</script>

<MediaQueryDesktop>
    <NavDesktop />
</MediaQueryDesktop>

<MediaQueryMobile>
    <NavMobile />
</MediaQueryMobile>
