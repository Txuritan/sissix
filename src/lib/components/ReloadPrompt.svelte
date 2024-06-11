<script lang="ts">
    import { useRegisterSW } from "virtual:pwa-register/svelte";

    import { toast } from "svelte-sonner";

    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
        onRegistered(swr) {
            console.log(`SW registered: ${swr}`);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        }
    });

    function close() {
        offlineReady.set(false)
        needRefresh.set(false)
    }

    $: showToast = $offlineReady || $needRefresh;

    $: if (showToast) {
        if ($offlineReady) {
            toast.info("App ready to work offline.");
        } else {
            toast.info("New content available, click on reload button to update.", {
                duration: Number.POSITIVE_INFINITY,
                action: {
                    label: "Reload",
                    onClick: () => updateServiceWorker(true),
                },
                onDismiss: (_t) => close(),
                onAutoClose: (_t) => close(),
            });
        }
    }
</script>
