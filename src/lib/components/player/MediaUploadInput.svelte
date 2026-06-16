<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { MediaUploader } from '$lib/utils/mediaUploader';

	async function handleFileSelect(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (!MediaUploader.isValidMediaFile(file)) {
			alert('対応していないファイル形式です');
			return;
		}
		const fileUrl = MediaUploader.createBlobUrl(file);

		// state に保存
		editorState.playerState.setMediaSource({
			type: 'file',
			fileUrl: fileUrl,
			fileName: file.name,
			mimeType: file.type
		});
	}
</script>

<div class="flex flex-col gap-2">
	<label class="block">
		<span class="cursor-pointer rounded bg-blue-300 px-3 py-2"> ファイルを選択 </span>
		<input type="file" accept="video/*,audio/*" onchange={handleFileSelect} hidden />
	</label>

	{#if editorState.playerState.mediaSource?.fileName}
		<p class="text-sm text-gray-600">
			📄 {editorState.playerState.mediaSource.fileName}
		</p>
	{/if}
</div>
