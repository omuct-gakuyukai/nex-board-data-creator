import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';

export function parseEditCSV(file: File): Promise<Row[]> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const rows = results.data as Row[];
				const validRows = rows.map((row) => ({
					id: row.id || crypto.randomUUID(),
					start: row.start || '',
					lyric: row.lyric || '',
					duration: row.duration || '',
					monitor: row.monitor || '',
					type: row.type || '',
					content: row.content || '',
					right: row.right || '',
					backOne: row.backOne || '',
					backTwo: row.backTwo || '',
					backThree: row.backThree || '',
					backFour: row.backFour || '',
					backFive: row.backFive || '',
					backSix: row.backSix || '',
					left: row.left || ''
				}));

				resolve(validRows);
			},
			error: (error) => reject(error)
		});
	});
}
