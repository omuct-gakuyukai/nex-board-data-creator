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
		const sorted = [...editorState.rows].sort((a, b) => (a.start || 0) - (b.start || 0));

		// 現在より前の行のみ抽出
		const pastRows = sorted.filter((row) => row.start <= time);

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

<div class="h-50 rounded-2xl bg-[#0a0a0a] px-5 pt-5 pb-2.5">
	<div class="flex flex-col items-center gap-1">
		<div class="flex">
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backOne}
					style:box-shadow={getGlow(activeColors?.backOne || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック1</div>
			</div>
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backTwo}
					style:box-shadow={getGlow(activeColors?.backTwo || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック2</div>
			</div>
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backThree}
					style:box-shadow={getGlow(activeColors?.backThree || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック3</div>
			</div>
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backFour}
					style:box-shadow={getGlow(activeColors?.backFour || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック4</div>
			</div>
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backFive}
					style:box-shadow={getGlow(activeColors?.backFive || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック5</div>
			</div>
			<div class="mx-0.5 flex flex-col">
				<div
					class="h-10 w-10 rounded-full transition-all duration-200"
					style:background={activeColors?.backSix}
					style:box-shadow={getGlow(activeColors?.backSix || '')}
				></div>
				<div class="mt-2 text-center text-sm text-white">バック6</div>
			</div>
		</div>

		<div
			class="flex w-full max-w-150 items-center justify-between border border-[#333] bg-[#111] px-1.5 pt-0 pb-2"
		>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-sm text-white">左サイド</div>
				<div
					class="h-10 w-10 rounded-lg transition-all duration-200"
					style:background={`${activeColors.left === 'on' ? '#ffffff' : activeColors.left === 'off' ? '#000000' : ''}`}
					style:box-shadow={getGlow(
						activeColors.left === 'on' ? '#ffffff' : activeColors.left === 'off' ? '#000000' : ''
					)}
				></div>
			</div>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-sm text-white">右サイド</div>
				<div
					class="h-10 w-10 rounded-lg transition-all duration-200"
					style:background={`${activeColors.right === 'on' ? '#ffffff' : activeColors.right === 'off' ? '#000000' : ''}`}
					style:box-shadow={getGlow(
						activeColors.right === 'on' ? '#ffffff' : activeColors.right === 'off' ? '#000000' : ''
					)}
				></div>
			</div>
		</div>
	</div>
</div>
