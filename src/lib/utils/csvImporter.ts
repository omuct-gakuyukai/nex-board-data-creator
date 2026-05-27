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
                    length: row.length || '',
                    monitor: row.monitor || '',
                    type: row.type || '',
                    content: row.content || '',
                    rightFront: row.rightFront || '',
                    rightMiddle: row.rightMiddle || '',
                    rightBack: row.rightBack || '',
                    leftFront: row.leftFront || '',
                    leftMiddle: row.leftMiddle || '',
                    leftBack: row.leftBack || '',
                    back: row.back || ''
                }));

                resolve(validRows);
            },
            error: (error) => reject(error)
        });
    });
}
