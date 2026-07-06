import type { Row } from '$lib/types/csv';
import type { YTPlayer } from '$lib/utils/youtubeLoader';

export interface MediaSource {
	type: 'youtube' | 'file';
	youtubeId?: string; // YouTube動画ID
	fileUrl?: string; // ローカルファイルURL
	fileName?: string; // ファイル名
	mimeType?: string; // 'video/mp4' | 'audio/mpeg' など
}

class PlayerState {
	// メディア情報
	mediaSource = $state<MediaSource | null>(null);

	// 再生制御
	isPlaying = $state(false);
	currentTime = $state(0); // 秒単位
	duration = $state(0); // 秒単位
	volume = $state(0.8);

	// プレイヤーリファレンス（video/audio 要素またはYouTube Player）
	playerRef = $state<HTMLVideoElement | HTMLAudioElement | YTPlayer | null>(null);

	setMediaSource(source: MediaSource) {
		this.mediaSource = source;
		this.currentTime = 0;
		this.duration = 0;
	}

	updateCurrentTime(time: number) {
		this.currentTime = time;
	}

	setDuration(duration: number) {
		this.duration = duration;
	}

	play() {
		this.isPlaying = true;
		if (this.playerRef) {
			if ('playVideo' in this.playerRef && typeof this.playerRef.playVideo === 'function') {
				// YouTube Player
				this.playerRef.playVideo();
			} else if ('play' in this.playerRef && typeof this.playerRef.play === 'function') {
				// HTML5 video/audio
				this.playerRef.play();
			}
		}
	}

	pause() {
		this.isPlaying = false;
		if (this.playerRef) {
			if ('pauseVideo' in this.playerRef && typeof this.playerRef.pauseVideo === 'function') {
				// YouTube Player
				this.playerRef.pauseVideo();
			} else if ('pause' in this.playerRef && typeof this.playerRef.pause === 'function') {
				// HTML5 video/audio
				this.playerRef.pause();
			}
		}
	}

	seek(time: number) {
		this.currentTime = time;
		if (this.playerRef) {
			if ('currentTime' in this.playerRef) {
				// HTML5 video/audio
				this.playerRef.currentTime = time;
			} else if ('seekTo' in this.playerRef && typeof this.playerRef.seekTo === 'function') {
				// YouTube Player
				this.playerRef.seekTo(time);
			}
		}
	}
}
class EditorState {
	groupName = $state('');
	songName = $state('');
	rows = $state<Row[]>([]);
	columns = [
		'start',
		'lyric',
		'duration',
		'monitor',
		'type',
		'color',
		'content',
		'left',
		'backOne',
		'backTwo',
		'backThree',
		'backFour',
		'backFive',
		'backSix',
		'right'
	] as const;

	focusedIndex = $state<number | null>(null);

	playerState = new PlayerState();

	constructor() {
		this.rows = [this.createEmptyRow()];
	}

	private createEmptyRow(): Row {
		return {
			id: crypto.randomUUID(),
			start: '',
			lyric: '',
			duration: '',
			monitor: '',
			type: '',
			color: '#fde047',
			content: '',
			left: '',
			backOne: '#000',
			backTwo: '#000',
			backThree: '#000',
			backFour: '#000',
			backFive: '#000',
			backSix: '#000',
			right: ''
		};
	}

	addRow() {
		const newRow = this.createEmptyRow();
		if (this.focusedIndex !== null) {
			this.rows.splice(this.focusedIndex + 1, 0, newRow);
			this.focusedIndex = this.focusedIndex + 1;
		} else {
			this.rows.push(newRow);
		}
	}

	deleteRow() {
		if (this.focusedIndex !== null) {
			this.rows.splice(this.focusedIndex, 1);
			this.focusedIndex = null;
		}
	}
}
export const editorState = new EditorState();
