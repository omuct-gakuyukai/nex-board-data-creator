<svelte:options runes={true} />

<script lang="ts">
	import Modal from './Modal.svelte';
	import { downloadAllFiles } from '$lib/utils/csvExporter';
	import { csvStore } from '$lib/state/editorState.svelte';
	import { parseEditCSV } from '$lib/utils/csvImporter';

	async function handleImport(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const rows = await parseEditCSV(file);
		csvStore.rows = rows; // 状態更新
	}

	let { groupName = '', songName = '' } = $props();

	let showModal = $state(false);

	function handleExport() {
		if (!groupName || !songName) {
			alert('グループ名と曲名を入力してください');
			return;
		}
		downloadAllFiles(csvStore.rows, groupName, songName);
	}
</script>

<header class="flex bg-blue-400 px-6 py-3">
	<h2 class="text-4xl font-bold">DataCreator for nex-board</h2>
	<input
		type="file"
		accept=".csv"
		class="ml-auto w-fit rounded-lg border bg-white p-2 outline-0"
		onchange={handleImport}
	/>
	<button
		class="ml-15 h-11 w-11 rounded-full border-2 bg-white text-3xl"
		onclick={() => {
			showModal = true;
		}}
	>
		?
	</button>
	<button
		id="DL"
		type="button"
		class="ml-5 rounded-lg bg-green-400 p-2 text-xl"
		onclick={handleExport}
	>
		Download CSV files
	</button>
</header>
<Modal
	show={showModal}
	onClose={() => {
		showModal = false;
	}}
>
	<h2 class="mb-3 text-3xl">データ作成にあたっての注意</h2>
	<p class=" text-xl text-black">
		<span class="font-bold text-red-500">!注意!</span> この注意をよく読み、データ作成を行ってください。注意を読まなかったことによる不利益に関して、学友会執行部は一切の責任を負いません。
	</p>
	<ul class="list-disc px-5 py-2">
		<li class="py-1">
			このページを閉じたり再読み込みすると、ダウンロードされていない編集中のデータが消失します。こまめに
			<span class="rounded-lg bg-green-400 p-2">Download CSV files</span>
			ボタンからファイルをダウンロードするようにしてください。
		</li>
		<li class="py-1">
			グループ名、曲名には半角英数字のみ使用可能です。日本語のグループ名や曲名についてはローマ字に直してください。またグループ名や曲名に記号が含まれる場合は省略してください。
		</li>
	</ul>
</Modal>
