<script lang="ts">
    import MediaQueryDesktop from "$lib/components/MediaQueryDesktop.svelte";
    import MediaQueryMobile from "$lib/components/MediaQueryMobile.svelte";

    import SettingsDesktop from "$lib/components/settings/SettingsDesktop.svelte";
    import SettingsMobile from "$lib/components/settings/SettingsMobile.svelte";
</script>

<MediaQueryDesktop>
    <SettingsDesktop />
</MediaQueryDesktop>

<MediaQueryMobile>
    <SettingsMobile />
</MediaQueryMobile>
