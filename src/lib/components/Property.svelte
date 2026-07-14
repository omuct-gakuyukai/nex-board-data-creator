<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { hasInvalidFileNamePart } from '$lib/utils/fileNameparser';

	const fileName = $derived(editorState.groupName + '__' + editorState.songName + '.csv');

	// 許可されていない文字が含まれているか判定する（含まれていれば true）
	const isGroupInvalid = $derived(hasInvalidFileNamePart(editorState.groupName));
	const isSongInvalid = $derived(hasInvalidFileNamePart(editorState.songName));
</script>

<div class="flex items-start px-5 py-3">
	<div class="mx-2 flex flex-col">
		<div
			class={`flex h-auto items-center rounded-xl px-3 py-2 text-xl ${isGroupInvalid ? 'bg-red-100 outline-2 outline-red-500' : 'bg-gray-200'}`}
		>
			Group:<input
				class="ml-1 rounded bg-transparent pl-1 outline-none"
				placeholder="半角英数字と一部の半角記号のみ"
				bind:value={editorState.groupName}
			/>
		</div>
		{#if isGroupInvalid}
			<span class="mt-1 pl-2 text-sm font-bold text-red-500">※使用できない文字が含まれています</span
			>
		{/if}
	</div>
	<div class="mx-2 flex flex-col">
		<div
			class={`flex h-auto items-center rounded-xl px-3 py-2 text-xl ${isSongInvalid ? 'bg-red-100 outline-2 outline-red-500' : 'bg-gray-200'}`}
		>
			Song:<input
				class="ml-1 rounded bg-transparent pl-1 outline-none"
				placeholder="半角英数字と一部の半角記号のみ"
				bind:value={editorState.songName}
			/>
		</div>
		{#if isSongInvalid}
			<span class="mt-1 pl-2 text-sm font-bold text-red-500">※使用できない文字が含まれています</span
			>
		{/if}
	</div>
	<div class="mx-2 flex flex-col">
		<div class="flex h-auto items-center rounded-xl bg-gray-200 px-3 py-2 text-xl">
			FileName: {editorState.groupName == '' || editorState.songName == ''
				? '(csvファイル名を表示)'
				: fileName}
		</div>
	</div>
</div>
