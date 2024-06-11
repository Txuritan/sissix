import App from './App.svelte'

if (import.meta.env.DEV) {
    const eruda = (await import("eruda")).default;
    eruda.init();
}

const app = new App({
    target: document.getElementById('app')!,
})

export default app
