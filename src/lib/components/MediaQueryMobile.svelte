<script lang="ts">
    import MediaQuery from "$lib/components/MediaQuery.svelte";
</script>

<MediaQuery query="(max-width: 481px)" let:matches>
    {#if matches}
    <slot></slot>
    {/if}
</MediaQuery>