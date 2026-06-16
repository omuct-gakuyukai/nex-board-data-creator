<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	const fileNameForMain = $derived(
		editorState.groupName + '_' + editorState.songName + '_main.csv'
	);
	const fileNameForSub = $derived(editorState.groupName + '_' + editorState.songName + '_sub.csv');
</script>

<div class="flex px-5 py-3">
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Group:<input
			class="ml-1 rounded pl-1 outline"
			placeholder="グループ名を入力"
			bind:value={editorState.groupName}
		/>
	</div>
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Song:<input
			class="ml-1 rounded pl-1 outline"
			placeholder="曲名を入力"
			bind:value={editorState.songName}
		/>
	</div>
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		FileName: {editorState.groupName == '' || editorState.songName == ''
			? '(csvファイル名を表示)'
			: fileNameForMain + ' / ' + fileNameForSub}
	</div>
</div>
