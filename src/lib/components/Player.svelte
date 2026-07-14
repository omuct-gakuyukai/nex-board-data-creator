<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import YouTubePlayer from './player/YouTubePlayer.svelte';
	import LocalMediaPlayer from './player/LocalMediaPlayer.svelte';
	import YouTubeInput from './player/YouTubeInput.svelte';
	import MediaUploadInput from './player/MediaUploadInput.svelte';

	let sourceMode = $state<'youtube' | 'file' | null>(null);
	const playerState = editorState.playerState;
</script>

<div class="my-2 h-45 w-80 rounded border border-gray-300">
	<div class="flex border-b bg-gray-100">
		<button
			class={`flex-1 cursor-pointer px-3 py-2 ${sourceMode === 'youtube' ? 'border-b-2 border-red-500 font-bold outline-0' : ''}`}
			onclick={() => (sourceMode = 'youtube')}
		>
			YouTube
		</button>
		<button
			class={`flex-1 cursor-pointer px-3 py-2 ${sourceMode === 'file' ? 'border-b-2 border-blue-500 font-bold outline-0' : ''}`}
			onclick={() => (sourceMode = 'file')}
		>
			ファイル
		</button>
	</div>

	<!-- コンテンツエリア -->
	<div class="flex-1 overflow-hidden">
		{#if sourceMode === 'youtube'}
			{#if playerState.mediaSource?.type === 'youtube' && playerState.mediaSource.youtubeId}
				<YouTubePlayer videoId={playerState.mediaSource.youtubeId} />
			{:else}
				<div class="flex h-full flex-col gap-2 p-3">
					<YouTubeInput />
				</div>
			{/if}
		{:else if sourceMode === 'file'}
			{#if playerState.mediaSource?.type === 'file'}
				<LocalMediaPlayer source={playerState.mediaSource} />
			{:else}
				<div class="flex h-full flex-col gap-2 p-3">
					<MediaUploadInput />
				</div>
			{/if}
		{:else}
			<div class="p-4 text-center text-gray-500">ソースを選択してください</div>
		{/if}
	</div>

	<div
		class={`mt-1 w-full border-t ${editorState.playerState.mediaSource === null ? 'hidden' : 'flex'}`}
	>
		<button
			class="mx-auto my-1 cursor-pointer rounded-lg bg-blue-300 px-3 text-center"
			onclick={() => editorState.playerState.setMediaSource(null)}
		>
			現在のソースを削除
		</button>
	</div>

	<!-- 再生コントロール -->
	{#if playerState.mediaSource}
		<div class="flex gap-2 border-t bg-gray-50 p-2">
			<button
				onclick={() => playerState.play()}
				disabled={playerState.isPlaying}
				class="cursor-pointer rounded bg-green-500 px-2 py-1 text-white disabled:opacity-50"
			>
				▶
			</button>
			<button
				onclick={() => playerState.pause()}
				disabled={!playerState.isPlaying}
				class="cursor-pointer rounded bg-orange-500 px-2 py-1 text-white disabled:opacity-50"
			>
				⏸
			</button>
			<input
				type="range"
				min="0"
				max={playerState.duration}
				value={playerState.currentTime}
				onchange={(e) => {
					const value = (e.target as HTMLInputElement).value;
					playerState.seek(+value);
				}}
				class="flex-1"
			/>
			<div class="flex flex-col">
				<label for="volume">音量</label>
				<input
					id="volume"
					type="range"
					min="0"
					max="100"
					value={playerState.volume * 100}
					oninput={(e) => {
						const volume = +(e.target as HTMLInputElement).value;
						const ref = playerState.playerRef;

						if (ref && 'setVolume' in ref) {
							ref.setVolume(volume);
						} else if (ref && 'volume' in ref) {
							ref.volume = volume / 100;
						}
						playerState.volume = volume;
					}}
					class="w-20"
				/>
			</div>
		</div>
	{/if}
</div>
