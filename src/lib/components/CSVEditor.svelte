<script lang="ts">
	import { editorState } from '$lib/state/editorState.svelte';
	import Toolbar from './editor/Toolbar.svelte';

	const placeHolder = {
		start: '秒',
		length: '秒',
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
		},
		rightFront: {
			default: '色を選択',
			red: '赤'
		},
		rightMiddle: {
			default: '色を選択',
			red: '赤'
		},
		rightBack: {
			default: '色を選択',
			red: '赤'
		},
		leftFront: {
			default: '色を選択',
			red: '赤'
		},
		leftMiddle: {
			default: '色を選択',
			red: '赤'
		},
		leftBack: {
			default: '色を選択',
			red: '赤'
		},
		back: {
			default: '色を選択',
			red: '赤'
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
					<th class="border py-1">開始時間</th>
					<th class="border py-1">表示時間</th>
					<th class="border py-1">モニター</th>
					<th class="border py-1">表示形式</th>
					<th class="border py-1">内容</th>
					<th class="border py-1">右前</th>
					<th class="border py-1">右中</th>
					<th class="border py-1">右後</th>
					<th class="border py-1">左前</th>
					<th class="border py-1">左中</th>
					<th class="border py-1">左後</th>
					<th class="border py-1">バック</th>
				</tr>
			</thead>
			<tbody class="bg-gray-300">
				{#each editorState.rows as row, rowIndex (row.id)}
					<tr
						onfocusin={() => (editorState.focusedIndex = rowIndex)}
						class={editorState.focusedIndex === rowIndex ? 'bg-blue-100' : ''}
					>
						{#each editorState.columns as column (column)}
							{#if column == 'start' || column == 'length' || column == 'content'}
								<td class={`${column != 'content' ? 'max-w-10' : 'max-w-50'} border p-1`}>
									<input
										bind:value={row[column]}
										placeholder={`${placeHolder[column]}`}
										class="w-full bg-transparent px-1 outline-0"
									/>
								</td>
							{:else}
								<td
									class={`${column != 'monitor' && column != 'type' ? 'max-w-13' : 'max-w-20'} border p-1`}
								>
									<select
										name={column}
										bind:value={row[column]}
										id={`${column}-${row.id}-select`}
										class="bg-transparent outline-0"
									>
										{#if options[column as keyof typeof options]}
											{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
												<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
											{/each}
										{:else}
											<option value="">選択肢なし</option>
										{/if}
									</select>
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
