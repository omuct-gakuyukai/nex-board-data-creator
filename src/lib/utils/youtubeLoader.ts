export function loadYouTubeAPI(): Promise<void> {
	return new Promise((resolve) => {
		if (window.YT && window.YT.Player) {
			resolve();
			return;
		}

		window.onYouTubeIframeAPIReady = (): void => {
			resolve();
		};

		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		script.async = true;
		document.body.appendChild(script);
	});
}

declare global {
	interface Window {
		YT: {
			Player: {
				new(element: HTMLElement | string, options: YTPlayerOptions): YTPlayer;
			};
			PlayerState: YTPlayerState;
		};
		onYouTubeIframeAPIReady: (() => void) | undefined;
	}
}

// YouTube Player API の型定義
export interface YTPlayerOptions {
	videoId: string;
	height?: string | number;
	width?: string | number;
	playerVars?: Record<string, unknown>;
	events?: {
		onReady?: (event: YTOnReadyEvent) => void;
		onStateChange?: (event: YTOnStateChangeEvent) => void;
	};
}

export interface YTOnReadyEvent {
	target: YTPlayer;
}

export interface YTOnStateChangeEvent {
	data: number;
	target: YTPlayer;
}

export interface YTPlayer {
	getPlayerState(): number;
	getCurrentTime(): number;
	getDuration(): number;
	getVolume(): number;
	setVolume(volume: number): void;
	playVideo(): void;
	pauseVideo(): void;
	seekTo(seconds: number): void;
	destroy(): void;
}

export interface YTPlayerState {
	UNSTARTED: number;
	ENDED: number;
	PLAYING: number;
	PAUSED: number;
	BUFFERING: number;
	CUED: number;
}
