<svelte:options runes={true} />

<script lang="ts">
	import Modal from './Modal.svelte';
	import { fileState } from '$lib/states/fileState.svelte';

	let showModal = $state(true);
	async function handleImport(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		try {
			await fileState.importCSV(file);
			target.value = ''; // インポート後にinputをリセット
		} catch (error) {
			console.error('インポートエラー:', error);
			alert('ファイルのインポートに失敗しました');
		}
	}
</script>

<header class="flex bg-blue-400 px-6 py-3">
	<h2 class="text-4xl font-bold">DataCreator for nex-board</h2>
	<input type="file" accept=".csv" onchange={handleImport} id="import-csv" hidden />
	<button
		onclick={() => document.getElementById('import-csv')?.click()}
		class="ml-auto rounded-lg bg-blue-300 p-2 text-xl"
	>
		Import CSV
	</button>
	<button
		class="ml-10 h-11 w-11 rounded-full border-2 bg-white text-3xl"
		onclick={() => {
			showModal = true;
		}}
	>
		?
	</button>
	<button onclick={fileState.exportCSV} class="ml-10 rounded-lg bg-green-400 p-2 text-xl">
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
			グループ名、曲名には半角英数字と半角丸括弧、半角ハイフン、半角アンダーバー、半角ピリオドのみ使用可能です。英語ではないグループ名や曲名についてはローマ字に直してください。またグループ名や曲名に使用できない記号が含まれる場合は省略してください。
		</li>
		<li class="py-1">
			ステージ照明について :
			左右のサイド照明については白点灯か消灯となっています。色指定は出来ませんのでご了承ください。
		</li>
	</ul>
</Modal>
