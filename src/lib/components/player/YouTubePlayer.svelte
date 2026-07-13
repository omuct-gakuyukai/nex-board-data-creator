<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import {
		loadYouTubeAPI,
		type YTPlayerOptions,
		type YTPlayer,
		type YTOnReadyEvent,
		type YTOnStateChangeEvent
	} from '$lib/utils/youtubeLoader';
	import { onMount } from 'svelte';

	let { videoId = '' } = $props();
	let container: HTMLDivElement;
	let playerRef: YTPlayer | null = null;
	let updateInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		const init = async () => {
			if (!videoId) return;
			await loadYouTubeAPI();
			initializePlayer();
		};

		init();

		return () => {
			if (updateInterval) clearInterval(updateInterval);
			if (editorState.playerState.playerRef === playerRef) editorState.playerState.playerRef = null;
			playerRef?.destroy?.();
		};
	});

	function initializePlayer() {
		const options: YTPlayerOptions = {
			videoId: videoId,
			height: '100%',
			width: '100%',
			playerVars: {
				autoplay: 0,
				controls: 1,
				modestbranding: 1
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onStateChange
			}
		};
		playerRef = new window.YT.Player(container, options);
	}

	function onPlayerReady(event: YTOnReadyEvent) {
		editorState.playerState.playerRef = event.target;

		updateInterval = setInterval(() => {
			if (playerRef && playerRef.getPlayerState?.() === window.YT.PlayerState.PLAYING) {
				const current = Math.floor(playerRef.getCurrentTime());
				const duration = Math.floor(playerRef.getDuration());
				editorState.playerState.updateCurrentTime(current);
				editorState.playerState.setDuration(duration);
			}
		}, 1000); // 1秒ごと
	}

	function onStateChange(event: YTOnStateChangeEvent) {
		// -1: 未初期化, 0: 終了, 1: 再生, 2: 一時停止, 3: バッファ中, 5: キュー中
		const playing = event.data === window.YT.PlayerState.PLAYING;
		editorState.playerState.isPlaying = playing;
	}
</script>

<div bind:this={container} class="h-full w-full"></div>
