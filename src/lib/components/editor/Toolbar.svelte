<script lang="ts">
	import { csvStore } from '$lib/state/editorState.svelte';
	import { parseEditCSV } from '$lib/utils/csvImporter';

	async function handleImport(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const rows = await parseEditCSV(file);
		csvStore.rows = rows; // 状態更新
	}
</script>

<div class="flex w-full border-x border-t bg-gray-100 px-5 py-2">
	<button onclick={() => csvStore.addRow()} type="button" class="rounded bg-blue-200 p-1"
		>行を追加</button
	>
	<input type="file" accept=".csv" onchange={handleImport} />
</div>
