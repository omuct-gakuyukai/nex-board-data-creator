<svelte:options runes={true} />

<script>
	let { show = false, onClose = () => {}, children } = $props();

	function close() {
		onClose();
	}
</script>

{#if show}
	<div class="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
		<div class="flex max-h-3/4 max-w-4/5 flex-col rounded bg-white p-3 shadow-md">
			{@render children()}
			<button onclick={close} class="mt-5 ml-auto rounded-lg bg-gray-300 px-2 py-1 text-lg">
				閉じる
			</button>
		</div>
	</div>
{/if}
