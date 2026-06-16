<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
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
	});
</script>

// src/lib/components/player/LocalMediaPlayer.svelte
{#if source?.mimeType?.startsWith('video')}
	<video bind:this={mediaElement} src={source.fileUrl} class="h-full w-full" controls>
		<track kind="captions" />
	</video>
{:else}
	<audio bind:this={mediaElement} src={source.fileUrl} class="w-full" controls></audio>
{/if}
