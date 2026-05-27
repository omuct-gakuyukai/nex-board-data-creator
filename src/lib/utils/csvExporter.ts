import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';

export function generateCSVFiles(rows: Row[]) {
	// main.csv: monitor=main のみ、right/left/foot/back は削除
	const mainRows = rows
		.filter((row) => row.monitor === 'main')
		.map((row) => ({
			start: row.start,
			length: row.length,
			monitor: row.monitor,
			type: row.type,
			content: row.content
		}));

	// sub.csv: monitor=sub のみ、right/left/foot/back は削除
	const subRows = rows
		.filter((row) => row.monitor === 'sub')
		.map((row) => ({
			start: row.start,
			length: row.length,
			monitor: row.monitor,
			type: row.type,
			content: row.content
		}));

	// light.csv: start + right/left/foot/back のみ
	const lightRows = rows.map((row) => ({
		start: row.start,
		right: row.right,
		left: row.left,
		foot: row.foot,
		back: row.back
	}));

	// edit.csv: 全データそのまま（復元用）
	const editRows = rows.map((row) => ({
		start: row.start,
		length: row.length,
		monitor: row.monitor,
		type: row.type,
		content: row.content,
		right: row.right,
		left: row.left,
		foot: row.foot,
		back: row.back
	}));

	return {
		main: Papa.unparse(mainRows),
		sub: Papa.unparse(subRows),
		light: Papa.unparse(lightRows),
		edit: Papa.unparse(editRows)
	};
}

export function downloadFile(content: string, filename: string) {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export function downloadAllFiles(rows: Row[], groupName: string, songName: string) {
	const csvFiles = generateCSVFiles(rows);
	const baseFileName = `${groupName}_${songName}`;

	// 4ファイルを順次ダウンロード
	setTimeout(() => downloadFile(csvFiles.main, `${baseFileName}_main.csv`), 0);
	setTimeout(() => downloadFile(csvFiles.sub, `${baseFileName}_sub.csv`), 200);
	setTimeout(() => downloadFile(csvFiles.light, `${baseFileName}_light.csv`), 400);
	setTimeout(() => downloadFile(csvFiles.edit, `${baseFileName}_edit.csv`), 600);
}
