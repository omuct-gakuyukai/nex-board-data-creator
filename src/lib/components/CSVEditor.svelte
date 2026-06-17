<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import Toolbar from './editor/Toolbar.svelte';

	const placeHolder = {
		start: '秒',
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
			roop: 'ループ表示',
			static: '固定表示'
		}
	};
</script>

<div class="relative flex max-h-105 w-full flex-col overflow-y-auto pl-5">
	<div class="sticky top-0 z-10">
		<Toolbar />
	</div>
	<div class="scroll-m-t-lg relative w-full border-b border-gray-300">
		<table class="w-full p-5 pt-0">
			<thead class="sticky top-10 z-10 bg-gray-200 shadow-sm">
				<tr>
					<th colspan="5" class="border py-1">電光掲示板</th>
					<th colspan="7" class="border py-1">ステージ照明</th>
				</tr>
				<tr>
					<th class="border py-1">開始時間</th>
					<th class="border py-1">表示時間</th>
					<th class="border py-1">モニター</th>
					<th class="border py-1">表示形式</th>
					<th class="border py-1">内容</th>
					<th class="border py-1">左サイド</th>
					<th class="border py-1">バック左</th>
					<th class="border py-1 text-xs">バック中央左</th>
					<th class="border py-1 text-xs">バック中央</th>
					<th class="border py-1 text-xs">バック中央右</th>
					<th class="border py-1">バック右</th>
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
							{#if column == 'start' || column == 'duration' || column == 'content'}
								<td class={`${column != 'content' ? 'w-22' : ''} border p-1`}>
									<input
										bind:value={row[column]}
										placeholder={`${placeHolder[column]}`}
										class="w-full bg-transparent px-1 outline-0"
									/>
								</td>
							{:else if column == 'monitor' || column == 'type'}
								<td class="w-20 border p-1">
									<select
										name={column}
										bind:value={row[column]}
										id={`${column}-${row.id}-select`}
										class="bg-transparent outline-0"
									>
										{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
											<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
										{/each}
									</select>
								</td>
							{:else}
								<td class="w-20 border p-0">
									<div class="bg-transparent px-px py-0">
										<div class="relative p-0" style={`background-color: ${row[column]};`}>
											<input
												bind:value={row[column]}
												type="color"
												class="min-h-full min-w-full cursor-pointer opacity-0"
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
