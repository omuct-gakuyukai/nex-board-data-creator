<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	// 共有タイミングロジックの使用
	const clock = usePreviewClock();

	// 現在の行を算出
	let currentRow = $derived.by(() => {
		const time = clock.time;
		const sorted = [...editorState.rows].sort((a, b) => parseFloat(a.start) - parseFloat(b.start));
		return sorted.findLast((row) => parseFloat(row.start) <= time) || null;
	});

	// ライトがオフ（黒）の場合は光らせない制御
	function getGlow(color: string) {
		const isOff = !color || color === '#000000' || color === '#000';
		return isOff ? 'none' : `0 0 25px ${color}`;
	}
</script>

<div class="stage-wrapper">
	<div class="stage-scene">
		<div class="row back">
			<div
				class="light"
				style:background={currentRow?.backLeft}
				style:box-shadow={getGlow(currentRow?.backLeft || '')}
			></div>
			<div
				class="light"
				style:background={currentRow?.backCenterLeft}
				style:box-shadow={getGlow(currentRow?.backCenterLeft || '')}
			></div>
			<div
				class="light"
				style:background={currentRow?.backCenter}
				style:box-shadow={getGlow(currentRow?.backCenter || '')}
			></div>
			<div
				class="light"
				style:background={currentRow?.backCenterRight}
				style:box-shadow={getGlow(currentRow?.backCenterRight || '')}
			></div>
			<div
				class="light"
				style:background={currentRow?.backRight}
				style:box-shadow={getGlow(currentRow?.backRight || '')}
			></div>
		</div>

		<div class="floor">
			<div
				class="light side"
				style:background={currentRow?.left}
				style:box-shadow={getGlow(currentRow?.left || '')}
			></div>
			<div
				class="light side"
				style:background={currentRow?.right}
				style:box-shadow={getGlow(currentRow?.right || '')}
			></div>
		</div>
	</div>
</div>

<style>
	.stage-wrapper {
		perspective: 1000px; /* 立体感の演出 */
		padding: 40px;
		background: #0a0a0a;
		border-radius: 16px;
	}

	.stage-scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
	}

	.row {
		display: flex;
		gap: 24px;
	}

	.floor {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 600px;
		background: #111;
		padding: 20px;
		transform: rotateX(30deg); /* ステージを斜めに倒す */
		border: 1px solid #333;
	}

	.light {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		transition:
			background 0.2s,
			box-shadow 0.2s;
	}

	.side {
		/* 必要に応じて左右のライトの形状を変更 */
		border-radius: 8px;
	}
</style>
