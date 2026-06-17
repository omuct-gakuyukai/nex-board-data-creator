<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	const clock = usePreviewClock();

	// --- 1. 仮想解像度と巨大フォントサイズの定義 ---
	const SUB_VIRTUAL_WIDTH = 1920 * 2; // 3840px (左側)
	const MAIN_VIRTUAL_WIDTH = 1920 * 3; // 5760px (右側)
	const TOTAL_VIRTUAL_WIDTH = SUB_VIRTUAL_WIDTH + MAIN_VIRTUAL_WIDTH; // 9600px
	const VIRTUAL_HEIGHT = 1080;
	const VIRTUAL_TEXT_SIZE = 1060;
	const PREVIEW_GAP = 24;

	let containerWidth = $state(0);

	let availableWidth = $derived(Math.max(0, containerWidth - PREVIEW_GAP));
	let globalScale = $derived(availableWidth > 0 ? availableWidth / TOTAL_VIRTUAL_WIDTH : 1);

	// --- 2. 行データの共通パース関数 ---
	function parseRow(row: (typeof editorState.rows)[0]) {
		const start = parseFloat(row.start) || 0;
		let duration = parseFloat(row.duration) || 0;
		const type = row.type?.trim() || 'slide';
		const content = row.content || '';

		if (type === 'static') {
			duration = 0;
		} else if (type === 'roop' || type === 'loop') {
			duration = 1200;
		}

		const isLoop = duration >= 1000;
		return { ...row, start, type, duration, content, isLoop };
	}

	// --- 3. monitorごとにタイムラインを完全分離 ---
	let subItems = $derived.by(() => {
		return editorState.rows
			.filter((row) => row.monitor?.trim() === 'sub')
			.map(parseRow)
			.sort((a, b) => a.start - b.start);
	});

	let mainItems = $derived.by(() => {
		return editorState.rows
			.filter((row) => row.monitor?.trim() === 'main')
			.map(parseRow)
			.sort((a, b) => a.start - b.start);
	});

	// --- 4. 該当アイテムの算出 ---
	function getCurrentItem(items: ReturnType<typeof parseRow>[], currentTime: number) {
		if (items.length === 0) return null;

		const activeItems = items.filter((i) => i.start <= currentTime);
		if (activeItems.length === 0) return null;

		const latest = activeItems[activeItems.length - 1];

		if (latest.type === 'slide') {
			if (currentTime - latest.start > latest.duration) {
				return null;
			}
		}
		return latest;
	}

	// ※ここからの計算はすべて独自クロック(animatedTime)をベースに動く
	let currentSubItem = $derived(getCurrentItem(subItems, clock.time));
	let currentMainItem = $derived(getCurrentItem(mainItems, clock.time));

	// --- 5. 座標計算ロジック ---
	function calcMetrics(text: string, size: number, virtualWidth: number) {
		let nonAsciiCount = 0;
		for (let i = 0; i < text.length; i++) {
			if (text.charCodeAt(i) > 127) {
				nonAsciiCount++;
			}
		}
		const asciiCount = text.length - nonAsciiCount;

		const textWidth = nonAsciiCount * size + asciiCount * size * 0.5;
		const initialOffset = (textWidth + virtualWidth) / 2.0 + 5.0;

		return { textWidth, initialOffset };
	}

	function calcCurrentX(
		item: ReturnType<typeof parseRow> | null,
		currentTime: number,
		virtualWidth: number
	) {
		if (!item) return 0;
		if (item.type === 'static' || item.duration === 0) return 0;

		const { textWidth, initialOffset } = calcMetrics(item.content, VIRTUAL_TEXT_SIZE, virtualWidth);
		const distance = textWidth + virtualWidth;

		let speed: number;
		let cycleDuration: number;

		if (item.isLoop) {
			speed = 500; // 500px/s 固定
			cycleDuration = distance / speed;
		} else {
			speed = distance / item.duration;
			cycleDuration = item.duration;
		}

		const localTime = currentTime - item.start;
		const timeToUse = item.isLoop ? localTime % cycleDuration : localTime;

		return initialOffset - speed * timeToUse;
	}

	let subX = $derived(calcCurrentX(currentSubItem, clock.time, SUB_VIRTUAL_WIDTH));
	let mainX = $derived(calcCurrentX(currentMainItem, clock.time, MAIN_VIRTUAL_WIDTH));
</script>

<div class="multi-monitor-previewer" bind:clientWidth={containerWidth}>
	<div class="monitor-labels-header">
		<div style:width="{SUB_VIRTUAL_WIDTH * globalScale}px">SUB MONITOR (3840×1080)</div>
		<div style:width="{PREVIEW_GAP}px"></div>
		<div style:width="{MAIN_VIRTUAL_WIDTH * globalScale}px">MAIN MONITOR (5760×1080)</div>
	</div>

	<div class="monitors-container" style:gap="{PREVIEW_GAP}px">
		<div
			class="ticker-viewport"
			style:width="{SUB_VIRTUAL_WIDTH * globalScale}px"
			style:height="{VIRTUAL_HEIGHT * globalScale}px"
		>
			<div
				class="virtual-stage"
				style:width="{SUB_VIRTUAL_WIDTH}px"
				style:height="{VIRTUAL_HEIGHT}px"
				style:transform="scale({globalScale})"
			>
				<div
					class="ticker-text text-yellow-300"
					style:visibility={currentSubItem ? 'visible' : 'hidden'}
					style:transform="translate(calc(-50% + {subX}px), -50%)"
					style:font-size="{VIRTUAL_TEXT_SIZE}px"
				>
					{currentSubItem?.content}
				</div>
			</div>
		</div>

		<div
			class="ticker-viewport"
			style:width="{MAIN_VIRTUAL_WIDTH * globalScale}px"
			style:height="{VIRTUAL_HEIGHT * globalScale}px"
		>
			<div
				class="virtual-stage"
				style:width="{MAIN_VIRTUAL_WIDTH}px"
				style:height="{VIRTUAL_HEIGHT}px"
				style:transform="scale({globalScale})"
			>
				<div
					class="ticker-text text-yellow-300"
					style:visibility={currentMainItem ? 'visible' : 'hidden'}
					style:transform="translate(calc(-50% + {mainX}px), -50%)"
					style:font-size="{VIRTUAL_TEXT_SIZE}px"
				>
					{currentMainItem?.content}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.multi-monitor-previewer {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 90%;
		margin: 24px auto;
		font-family: sans-serif;
		box-sizing: border-box;
	}

	.monitor-labels-header {
		display: flex;
		font-size: 11px;
		font-weight: bold;
		color: #888;
		font-family: monospace;
		white-space: nowrap;
		overflow: hidden;
	}

	.monitors-container {
		display: flex;
		width: 100%;
	}

	.ticker-viewport {
		background-color: #000000;
		border: 2px solid #333333;
		border-radius: 4px;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		will-change: width, height;
	}

	.virtual-stage {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: top left;
	}

	.ticker-text {
		position: absolute;
		top: 50%;
		left: 50%;
		white-space: nowrap;
		/* color: #ff3e00; を削除（Tailwindにお任せ） */
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		line-height: 1;
		/* テキストのグロウ効果（光沢）はイエローに合うよう少し調整 */
		text-shadow: 0 0 15px rgba(253, 224, 71, 0.4);
		will-change: transform;
	}
</style>
