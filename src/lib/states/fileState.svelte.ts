import { editorState } from './editorState.svelte';
import { hasValidFileNamePart, parseFileName } from '$lib/utils/fileNameparser';
import { parseEditCSV } from '$lib/utils/csvImporter';
import { downloadAllFiles } from '$lib/utils/csvExporter';

class FileState {
	async importCSV(file: File) {
		const parsed = parseFileName(file.name);
		console.log('File name parsed:', parsed);

		const rows = await parseEditCSV(file);
		editorState.rows = rows;
		if (parsed) {
			editorState.groupName = parsed.groupName;
			editorState.songName = parsed.songName;
			console.log('Updated State:', editorState.groupName, editorState.songName);
		}
	}

	exportCSV() {
		// 1. 空白チェック
		if (!editorState.groupName.trim() || !editorState.songName.trim()) {
			alert('グループ名と曲名を入力してください');
			return;
		}

		// 2. 不正文字チェック
		if (hasValidFileNamePart(editorState.groupName) || hasValidFileNamePart(editorState.songName)) {
			alert('ファイル名に使用できない文字が含まれています。赤枠のエラーを修正してください。');
			return;
		}

		// 3. ダウンロード実行
		downloadAllFiles(editorState.rows, editorState.groupName, editorState.songName);
	}
}

export const fileState = new FileState();
