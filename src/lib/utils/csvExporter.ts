import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';

export function generateCSVFiles(rows: Row[]) {
	const csvRows = rows.map((row) => ({
		start: row.start,
		duration: row.duration,
		monitor: row.monitor,
		type: row.type,
		content: row.content,
		left: row.left,
		backOne: row.backOne,
		backTwo: row.backTwo,
		backThree: row.backThree,
		backFour: row.backFour,
		backFive: row.backFive,
		backSix: row.backSix,
		right: row.right,
	}));

	return {
		csv: Papa.unparse(csvRows)
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

	setTimeout(() => downloadFile(csvFiles.csv, `${baseFileName}.csv`), 0);
}
