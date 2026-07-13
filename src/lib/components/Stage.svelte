<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	// 共有タイミングロジックの使用
	const clock = usePreviewClock();

	const lightColumns = [
		'left',
		'right',
		'backOne',
		'backTwo',
		'backThree',
		'backFour',
		'backFive',
		'backSix'
	] as const;

	let activeColors = $derived.by(() => {
		const time = clock.time;
		const sorted = [...editorState.rows].sort(
			(a, b) => (parseFloat(a.start) || 0) - (parseFloat(b.start) || 0)
		);

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
		const isOff = !color || color === '#000000' || color === '#000' || color === 'off';
		return isOff ? 'none' : `0 0 25px ${color}`;
	}
</script>

<div class="stage-wrapper">
	<div class="stage-scene">
		<div class="row back flex">
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backOne}
					style:box-shadow={getGlow(activeColors?.backOne || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />1</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backTwo}
					style:box-shadow={getGlow(activeColors?.backTwo || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />2</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backThree}
					style:box-shadow={getGlow(activeColors?.backThree || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />3</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backFour}
					style:box-shadow={getGlow(activeColors?.backFour || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />4</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backFive}
					style:box-shadow={getGlow(activeColors?.backFive || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />5</div>
			</div>
			<div class="light-wrapper flex flex-col">
				<div
					class="light"
					style:background={activeColors?.backSix}
					style:box-shadow={getGlow(activeColors?.backSix || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック<br />6</div>
			</div>
		</div>

		<div class="floor flex">
			<div class="flex flex-col items-center">
				<div class="mb-2 text-white">左サイド</div>
				<div
					class="light side"
					style:background={`${activeColors.left === 'on' ? '#ffffff' : activeColors.left === 'off' ? '#000000' : ''}`}
					style:box-shadow={getGlow(
						activeColors.left === 'on' ? '#ffffff' : activeColors.left === 'off' ? '#000000' : ''
					)}
				></div>
			</div>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-white">右サイド</div>
				<div
					class="light side"
					style:background={`${activeColors.right === 'on' ? '#ffffff' : activeColors.right === 'off' ? '#000000' : ''}`}
					style:box-shadow={getGlow(
						activeColors.right === 'on' ? '#ffffff' : activeColors.right === 'off' ? '#000000' : ''
					)}
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
		margin-left: 2px;
		margin-right: 2px;
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
