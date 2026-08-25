<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /><title>Nex-Board-Data-Creator</title></svelte:head>

<main class="flex max-h-screen flex-col">
	{@render children()}
</main>
