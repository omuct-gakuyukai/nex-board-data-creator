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
					duration: row.duration || '',
					monitor: row.monitor || '',
					type: row.type || '',
					content: row.content || '',
					right: row.right || '',
					backRight: row.backRight || '',
					backCenterRight: row.backCenterRight || '',
					backCenter: row.backCenter || '',
					backCenterLeft: row.backCenterLeft || '',
					backLeft: row.backLeft || '',
					left: row.left || ''
				}));

				resolve(validRows);
			},
			error: (error) => reject(error)
		});
	});
}
