<script lang="ts">
	import { csvStore } from '$lib/state/editorState.svelte';
</script>

<div class="w-full border-x border-t bg-gray-100 px-5 py-2">
	<button onclick={() => csvStore.addRow()} type="button" class="rounded bg-blue-200 p-1"
		>行を追加</button
	>
</div>
