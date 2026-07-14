<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { MediaUploader } from '$lib/utils/mediaUploader';
	import { onMount } from 'svelte';

	let { source } = $props();
	let mediaElement: HTMLVideoElement | HTMLAudioElement | null = $state(null);

	onMount(() => {
		if (!mediaElement) return;

		editorState.playerState.playerRef = mediaElement;

		mediaElement.addEventListener('loadedmetadata', () => {
			editorState.playerState.setDuration(mediaElement!.duration);
		});

		mediaElement.addEventListener('timeupdate', () => {
			editorState.playerState.updateCurrentTime(mediaElement!.currentTime);
		});

		mediaElement.addEventListener('play', () => (editorState.playerState.isPlaying = true));
		mediaElement.addEventListener('pause', () => (editorState.playerState.isPlaying = false));
		mediaElement.addEventListener('ended', () => (editorState.playerState.isPlaying = false));

		return () => {
			if (editorState.playerState.mediaSource?.fileUrl) {
				MediaUploader.revokeBlobUrl(editorState.playerState.mediaSource?.fileUrl);
			}
			if (editorState.playerState.playerRef === mediaElement)
				editorState.playerState.playerRef = null;
		};
	});
</script>

{#if source?.mimeType?.startsWith('video')}
	<video bind:this={mediaElement} src={source.fileUrl} class="h-full w-full" controls>
		<track kind="captions" />
	</video>
{:else}
	<audio bind:this={mediaElement} src={source.fileUrl} class="w-full" controls></audio>
{/if}
