<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
</script>

<div class="flex w-full gap-3 border-x border-t bg-gray-100 px-5 py-3">
	<button onclick={() => editorState.addRow()} type="button" class="rounded bg-blue-200 p-1">
		行を追加
	</button>
	<button onclick={() => editorState.deleteRow()} type="button" class="rounded bg-red-200 p-1">
		行を削除
	</button>
</div>
