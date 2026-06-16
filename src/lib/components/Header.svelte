<svelte:options runes={true} />

<script lang="ts">
	import Modal from './Modal.svelte';
	import { downloadAllFiles } from '$lib/utils/csvExporter';
	import { editorState } from '$lib/states/editorState.svelte';
	import { parseEditCSV } from '$lib/utils/csvImporter';
	import { parseFileName } from '$lib/utils/fileNameparser';

	async function handleImport(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		try {
			const parsed = parseFileName(file.name);
			if (parsed) {
				editorState.groupName = parsed.groupName;
				editorState.songName = parsed.songName;
			}
			const rows = await parseEditCSV(file);
			editorState.rows = rows;
		} catch (error) {
			console.error('インポートエラー:', error);
			alert('ファイルのインポートに失敗しました');
		}
	}

	let showModal = $state(false);

	function handleExport() {
		if (!editorState.groupName || !editorState.songName) {
			alert('グループ名と曲名を入力してください');
			return;
		}
		downloadAllFiles(editorState.rows, editorState.groupName, editorState.songName);
	}
</script>

<header class="flex bg-blue-400 px-6 py-3">
	<h2 class="text-4xl font-bold">DataCreator for nex-board</h2>
	<input type="file" accept=".csv" onchange={handleImport} id="import-csv" hidden />
	<button
		type="button"
		class="ml-auto rounded-lg bg-blue-300 p-2 text-xl"
		onclick={() => document.getElementById('import-csv')?.click()}
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
	<button
		id="DL"
		type="button"
		class="ml-10 rounded-lg bg-green-400 p-2 text-xl"
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
