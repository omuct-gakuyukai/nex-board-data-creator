<script lang="ts">
	let groupName = $state('');
	let songName = $state('');
	const fileNameForMain = $derived(groupName + '_' + songName + '_main.csv');
	const fileNameForSub = $derived(groupName + '_' + songName + '_sub.csv');
</script>

<div class="flex px-5 py-3">
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Group:<input
			class="ml-1 rounded pl-1 outline"
			placeholder="グループ名を入力"
			bind:value={groupName}
		/>
	</div>
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		Song:<input class="ml-1 rounded pl-1 outline" placeholder="曲名を入力" bind:value={songName} />
	</div>
	<div class="mx-2 flex rounded-xl bg-gray-200 px-3 py-2 text-xl">
		FileName: {groupName == '' || songName == ''
			? '(csvファイル名を表示)'
			: fileNameForMain + ' / ' + fileNameForSub}
	</div>
</div>
