<svelte:options runes={true} />

<script lang="ts">
	import Modal from './Modal.svelte';
	import { fileState } from '$lib/states/fileState.svelte';
	import { CSVError } from '$lib/utils/csvImporter';

	let showWarning = $state(true);
	let showHint = $state(false);
	async function handleImport(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		try {
			await fileState.importCSV(file);
		} catch (error) {
			if (error instanceof CSVError) {
				switch (error.type) {
					case 'CSV_IMPORT_ERROR':
						// CSVインポートエラー
						alert('csvファイルのインポートに失敗しました');
						break;
					case 'CSV_IMPORT_CANCELED':
						alert('csvファイルのインポートがキャンセルされました');
						break;
					case 'CSV_FORMAT_ERROR':
						alert(
							'アップロードされたcsvファイルのフォーマットが異なるためインポートがキャンセルされました'
						);
						break;
					case 'CSV_DATA_ERROR':
						alert('アップロードされたcsvファイルが破損していたためインポートに失敗しました');
						break;
					default:
						alert('不明なエラー');
						break;
				}
			} else {
				alert('不明なエラー');
				console.error(error);
			}
		}
		target.value = ''; // インポート後にinputをリセット
	}
</script>

<header class="flex bg-blue-400 px-6 py-3">
	<h2 class="text-4xl font-bold">DataCreator for Nex-Board</h2>
	<input type="file" accept=".csv" onchange={handleImport} id="import-csv" hidden />
	<button
		onclick={() => document.getElementById('import-csv')?.click()}
		class="ml-auto cursor-pointer rounded-lg bg-blue-300 p-2 text-xl"
	>
		Import CSV
	</button>
	<button
		class="ml-7 h-11 w-11 cursor-pointer rounded-full border-2 bg-white text-3xl transition-colors hover:bg-green-300"
		onclick={() => {
			showHint = true;
		}}
	>
		?
	</button>
	<button
		class="ml-4 h-11 w-11 cursor-pointer rounded-full border-2 bg-white text-3xl transition-colors hover:bg-yellow-300"
		onclick={() => {
			showWarning = true;
		}}
	>
		<span class="font-mono">&#9888;</span>
	</button>
	<button
		onclick={() => fileState.exportCSV()}
		class="ml-8 cursor-pointer rounded-lg bg-green-400 p-2 text-xl"
	>
		Download CSV files
	</button>
</header>
<Modal
	show={showHint}
	onClose={() => {
		showHint = false;
	}}
>
	<h2 class="mb-1 text-3xl">How to use</h2>
	<div class="flex">
		<div>
			<ul class="list-decimal px-5 py-2">
				<li class="py-1">編集途中のcsvファイルをインポートするボタン</li>
				<li class="py-1">左:使い方を表示するボタン 右:注意事項を表示するボタン</li>
				<li class="py-1">csvファイルをダウンロードするボタン</li>
				<li class="py-1">
					YouTubeまたはファイルの再生時間を表示するエリア<br
					/>左にcsvに入力するための再生開始からの秒数、右に現在時間/合計時間を分:秒形式で表示
				</li>
				<li class="py-1">グループ名と曲名を入力するエリア</li>
				<li class="py-1">
					電光掲示板に表示される内容をプレビューするエリア, 左がサブモニター、右がメインモニター
				</li>
				<li class="py-1">ステージ照明の色を簡単に確認するエリア</li>
				<li class="py-1">タイミングを調整するための元動画/音源を再生するエリア</li>
				<li class="py-1">
					電光掲示板に関する内容を入力する列
					<table>
						<tbody>
							<tr>
								<td class="w-22 text-start align-top">開始時間:</td>
								<td>テキストを流し始める時間を秒単位で指定する</td>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">目安の歌詞:</td>
								<td
									>テキストを流し始めるタイミングの目安となる、流したい歌詞やテキストの前の歌詞を入力する<br
									/>(例: "緑なす 生駒山脈" の "生駒山脈"を電光掲示板に流したい場合、"緑なす"と入力)</td
								>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">表示時間: </td>
								<td>スライド表示の場合に何秒間かけて流すかの秒数を入力する</td>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">モニター: </td>
								<td>テキストを表示したいモニターを選択する</td>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">表示形式: </td>
								<td>表示形式をスライド表示/ループ表示/固定表示から選択</td>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">文字色: </td>
								<td>表示する文字の色を入力する</td>
							</tr>
							<tr>
								<td class="w-22 text-start align-top">内容: </td>
								<td>表示する内容を入力する</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="py-1">ステージ照明(バック)に指定する色を入力する列</li>
				<li class="py-1">ステージ照明(サイド)の白点灯/消灯を選択する列</li>
			</ul>
		</div>
		<img src="/how2.png" alt="使い方解説用画像" class="size-50/100" />
	</div>
	<h3 class="mt-2 mb-1 text-xl">ステージ照明について :</h3>
	<ul class="list-disc px-5">
		<li>左右のサイド照明は白点灯か消灯となっています。色指定は出来ませんのでご了承ください。</li>
		<li>
			バックの照明について:
			チェックボックスからチェックを外すと、最近設定された色のまま点灯し続けます。消灯したい場合はチェックボックスにチェックを入れ、黒(RGBで0,0,0)を指定してください。
		</li>
	</ul>
</Modal>

<Modal
	show={showWarning}
	onClose={() => {
		showWarning = false;
	}}
>
	<h2 class="mb-3 text-3xl">データ作成にあたっての注意</h2>
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
			電光掲示板に表示するテキストには、
			<ul class="list-disc px-5">
				<li>日本語(ひらがな・カタカナ・漢字)</li>
				<li>英数字</li>
				<li>一般的な記号</li>
			</ul>
			が使用できます。<br />
			絵文字や特殊な記号は使用できません。
		</li>
		<li class="py-1">
			使い方は
			<span class=" mx-1 rounded-full border-2 bg-white px-2 text-2xl"> ? </span>
			ボタンから、この注意事項は
			<span class=" mx-1 rounded-full border-2 bg-white px-1 py-0.5 font-mono text-2xl">
				&#9888;
			</span>
			ボタンから確認できます。
		</li>
	</ul>
	<p class="font-bold">免責事項</p>
	<ul class="list-decimal px-5">
		<li class="text-black">
			利用者が本注意事項を確認しなかったことにより発生した不利益、損害、その他の問題について、学友会執行部は一切の責任を負わないものとします。
		</li>
	</ul>
</Modal>
