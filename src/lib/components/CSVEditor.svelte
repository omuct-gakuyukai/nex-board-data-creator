<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import Toolbar from './editor/Toolbar.svelte';

	const placeHolder = {
		start: '秒',
		lyric: '歌詞',
		duration: '秒',
		content: '内容'
	};
	const options = {
		monitor: {
			default: 'モニターを選択',
			sub: 'サブモニター',
			main: 'メインモニター'
		},
		type: {
			default: '表示形式を選択',
			slide: 'スライド表示',
			loop: 'ループ表示',
			static: '固定表示'
		},
		left: {
			default: '',
			on: '点灯',
			off: '消灯'
		},
		right: {
			default: '',
			on: '点灯',
			off: '消灯'
		}
	};

	function handleTypeChange(row: (typeof editorState.rows)[0], column: string) {
		if (column === 'type') {
			if (row.type === 'static') {
				row.duration = '0';
			} else if (row.type === 'loop') {
				row.duration = '1200';
			}
		}
	}
</script>

<div class="relative flex max-h-105 w-full flex-col overflow-y-auto pl-5">
	<div class="sticky top-0 z-10">
		<Toolbar />
	</div>
	<div class="scroll-m-t-lg relative w-full border-b border-gray-300">
		<table class="w-full p-5 pt-0">
			<thead class="sticky top-10 z-10 bg-gray-200 shadow-sm">
				<tr>
					<th colspan="7" class="border py-1">電光掲示板</th>
					<th colspan="8" class="border py-1">ステージ照明</th>
				</tr>
				<tr>
					<th class="border py-1">開始時間</th>
					<th class="border py-1">目安の歌詞</th>
					<th class="border py-1">表示時間</th>
					<th class="border py-1">モニター</th>
					<th class="border py-1">表示形式</th>
					<th class="border py-1">文字色</th>
					<th class="border py-1">内容</th>
					<th class="border py-1">左サイド</th>
					<th class="border py-1">バック1</th>
					<th class="border py-1">バック2</th>
					<th class="border py-1">バック3</th>
					<th class="border py-1">バック4</th>
					<th class="border py-1">バック5</th>
					<th class="border py-1">バック6</th>
					<th class="border py-1">右サイド</th>
				</tr>
			</thead>
			<tbody class="bg-gray-300">
				{#each editorState.rows as row, rowIndex (row.id)}
					<tr
						onfocusin={() => (editorState.focusedIndex = rowIndex)}
						class={editorState.focusedIndex === rowIndex ? 'bg-blue-100' : ''}
					>
						{#each editorState.columns as column (column)}
							{#if column == 'lyric' || column == 'content'}
								<td class={`${column != 'content' && column != 'lyric' ? 'w-22' : ''} border p-1`}>
									<input
										bind:value={row[column]}
										placeholder={`${placeHolder[column]}`}
										class="w-full bg-transparent px-1 outline-0"
									/>
								</td>
							{:else if column == 'start' || column == 'duration'}
								{@const isDurationDisabled =
									column === 'duration' && (row.type === 'static' || row.type === 'loop')}
								<td class="w-18 border p-1">
									<input
										bind:value={row[column]}
										type="number"
										placeholder={`${placeHolder[column]}`}
										disabled={isDurationDisabled}
										class="w-full bg-transparent px-1 outline-0 disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</td>
							{:else if column == 'monitor' || column == 'type'}
								<td class="w-20 border p-1">
									<select
										name={column}
										bind:value={row[column]}
										id={`${column}-${row.id}-select`}
										class="cursor-pointer bg-transparent outline-0"
										onchange={() => handleTypeChange(row, column)}
									>
										{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
											<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
										{/each}
									</select>
								</td>
							{:else if column == 'left' || column == 'right'}
								<td class="w-17 border p-1">
									<select
										name={column}
										bind:value={row[column]}
										class="cursor-pointer bg-transparent outline-0"
										id={`${column}-${row.id}-select`}
									>
										{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
											<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
										{/each}
									</select>
								</td>
							{:else if column == 'color'}
								<td class="w-15 border p-0">
									<div class="flex items-center justify-center gap-1 bg-transparent px-px py-0">
										<div
											class="relative h-6 w-6 rounded border border-gray-400"
											style={`background-color: ${row[column] !== '' ? row[column] : 'transparent'};`}
										>
											<input
												bind:value={row[column]}
												type="color"
												disabled={row[column] === ''}
												class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
											/>
										</div>
									</div>
								</td>
							{:else}
								<td class="w-18 border p-0">
									<div class="flex items-center justify-center gap-1 bg-transparent px-px py-0">
										<input
											type="checkbox"
											checked={row[column] !== ''}
											onchange={(e) => {
												const isChecked = (e.target as HTMLInputElement).checked;
												if (isChecked) {
													// ONにした時、色が空ならデフォルトの黒をセット
													if (row[column] === '') row[column] = '#000000';
												} else {
													// OFFにした時、色をクリア
													row[column] = '';
												}
											}}
											class="cursor-pointer"
										/>

										<div
											class="relative h-6 w-6 rounded border border-gray-400"
											style={`background-color: ${row[column] !== '' ? row[column] : 'transparent'};`}
										>
											<input
												bind:value={row[column]}
												type="color"
												disabled={row[column] === ''}
												class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
											/>
										</div>
									</div>
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
