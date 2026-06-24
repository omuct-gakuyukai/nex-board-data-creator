<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';

	const playerState = editorState.playerState;

	function formatTime(seconds: number): string {
		const totalSeconds = Math.floor(seconds);
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${totalSeconds}秒 | ${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="my-3 mr-15 ml-auto flex rounded-xl bg-gray-200 px-5 py-2 font-mono text-xl">
	<div class="my-auto mr-5 text-base text-gray-600">再生時間</div>
	<div class="flex flex-col">
		<div class="text-xl">
			{formatTime(playerState.currentTime)}/{Math.floor(playerState.duration / 60)}:{Math.floor(
				playerState.duration % 60
			)
				.toString()
				.padStart(2, '0')}
		</div>
		<div class=" w-42 rounded bg-gray-300">
			<div
				class="h-2 rounded bg-blue-500 transition-all"
				style:width={playerState.duration > 0
					? `${(playerState.currentTime / playerState.duration) * 100}%`
					: '0%'}
			></div>
		</div>
	</div>
</div>
