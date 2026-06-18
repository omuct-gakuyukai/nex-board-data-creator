import { editorState } from './editorState.svelte';
import { parseFileName } from '$lib/utils/fileNameparser';
import { parseEditCSV } from '$lib/utils/csvImporter';
import { downloadAllFiles } from '$lib/utils/csvExporter';

class FileState {
    async importCSV(file: File) {
        const parsed = parseFileName(file.name);
        console.log('Parsed:', parsed);

        if (parsed) {
            editorState.groupName = parsed.groupName;
            editorState.songName = parsed.songName;
            console.log('Updated State:', editorState.groupName, editorState.songName);
        }

        const rows = await parseEditCSV(file);
        editorState.rows = rows;
    }

    exportCSV() {
        // グループ名・曲名が空かどうかをeditorStateから正しくチェック
        if (!editorState.groupName.trim() || !editorState.songName.trim()) {
            alert('グループ名と曲名を入力してください');
            return;
        }
        downloadAllFiles(editorState.rows, editorState.groupName, editorState.songName);
    }
}

export const fileState = new FileState();