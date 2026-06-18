<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	function sanitizeInput(value: string) {
		return value.replace(/[^a-zA-Z0-9_().-]/g, '');
	}

	const fileName = $derived(editorState.groupName + '_' + editorState.songName + '.csv');
</script>

<div class="flex px-5 py-3">
	<div class="mx-2 flex h-auto items-center rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Group:<input
			class="ml-1 rounded pl-1 outline"
			placeholder="半角英数字と一部の半角記号のみ"
			value={editorState.groupName}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				editorState.groupName = sanitizeInput(target.value);
				target.value = editorState.groupName; // 表示を同期
			}}
		/>
	</div>
	<div class="mx-2 flex h-auto items-center rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Song:<input
			class="ml-1 rounded pl-1 outline"
			placeholder="半角英数字と一部の半角記号のみ"
			value={editorState.songName}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				editorState.songName = sanitizeInput(target.value);
				target.value = editorState.songName; // 表示を同期
			}}
		/>
	</div>
	<div class="mx-2 flex h-auto items-center rounded-xl bg-gray-200 px-3 py-2 text-xl">
		FileName: {editorState.groupName == '' || editorState.songName == ''
			? '(csvファイル名を表示)'
			: fileName}
	</div>
</div>
