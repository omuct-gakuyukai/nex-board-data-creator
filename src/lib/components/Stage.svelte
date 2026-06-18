<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	// 共有タイミングロジックの使用
	const clock = usePreviewClock();

	const lightColumns = [
		'left',
		'right',
		'backLeft',
		'backCenterLeft',
		'backCenter',
		'backCenterRight',
		'backRight'
	] as const;

	let activeColors = $derived.by(() => {
		const time = clock.time;
		const sorted = [...editorState.rows].sort((a, b) => parseFloat(a.start) - parseFloat(b.start));

		// 現在より前の行のみ抽出
		const pastRows = sorted.filter((row) => parseFloat(row.start) <= time);

		// 各列ごとに「最後に色が入力されていた値」を探す
		const latestColors: Record<string, string> = {};

		lightColumns.forEach((col) => {
			// 下から遡って、空文字ではない最初の値を見つける
			const lastValidRow = [...pastRows].reverse().find((row) => row[col] && row[col] !== '');
			latestColors[col] = lastValidRow ? lastValidRow[col] : '#000000'; // 見つからなければ黒
		});

		return latestColors;
	});

	// ライトがオフ（黒）の場合は光らせない制御
	function getGlow(color: string) {
		const isOff = !color || color === '#000000' || color === '#000';
		return isOff ? 'none' : `0 0 25px ${color}`;
	}
</script>

<div class="stage-wrapper">
	<div class="stage-scene">
		<div class="row back flex">
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backLeft}
					style:box-shadow={getGlow(activeColors?.backLeft || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />左</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backCenterLeft}
					style:box-shadow={getGlow(activeColors?.backCenterLeft || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />中央左</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backCenter}
					style:box-shadow={getGlow(activeColors?.backCenter || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />中央</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backCenterRight}
					style:box-shadow={getGlow(activeColors?.backCenterRight || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />中央右</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backRight}
					style:box-shadow={getGlow(activeColors?.backRight || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />右</div>
			</div>
		</div>

		<div class="floor flex">
			<div class="flex flex-col items-center">
				<div class="mb-2 text-white">左サイド</div>
				<div
					class="light side"
					style:background={activeColors?.left}
					style:box-shadow={getGlow(activeColors?.left || '')}
				></div>
			</div>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-white">右サイド</div>
				<div
					class="light side"
					style:background={activeColors?.right}
					style:box-shadow={getGlow(activeColors?.right || '')}
				></div>
			</div>
		</div>
	</div>
</div>

<style>
	.stage-wrapper {
		padding-top: 20px;
		padding-right: 20px;
		padding-left: 20px;
		padding-bottom: 10px;
		background: #0a0a0a;
		border-radius: 16px;
		height: 240px;
	}

	.stage-scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.row {
		display: flex;
	}

	.light-wrapper {
		margin: 0;
		margin-left: 7px;
		margin-right: 7px;
	}

	.floor {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 600px;
		background: #111;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 0px;
		padding-bottom: 20px;
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
