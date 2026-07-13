import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';
import { editorState } from '$lib/states/editorState.svelte';

type CSVErrorType =
	| 'CSV_FORMAT_ERROR'
	| 'CSV_IMPORT_ERROR'
	| 'CSV_DATA_ERROR'
	| 'CSV_IMPORT_CANCELED';
export class CSVError extends Error {
	constructor(
		public type: CSVErrorType,
		message: string
	) {
		super(message);
	}
}

export function parseEditCSV(file: File): Promise<Row[]> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				let rowEditing = true;
				let isEditing = false;

				const eRows = editorState.rows[0];
				if (
					eRows.start === 0 ||
					eRows.lyric === '' ||
					eRows.duration === 0 ||
					eRows.monitor === '' ||
					eRows.type === '' ||
					eRows.color === '#fde047' ||
					eRows.content === '' ||
					eRows.left === '' ||
					eRows.backOne === '' ||
					eRows.backTwo === '' ||
					eRows.backThree === '' ||
					eRows.backFour === '' ||
					eRows.backFive === '' ||
					eRows.backSix === '' ||
					eRows.right === ''
				) {
					rowEditing = false;
				}

				if (editorState.rows.length > 1 || rowEditing) {
					isEditing = true;
				}

				if (isEditing) {
					if (
						confirm(
							'CSVファイルをインポートすると編集中のデータは上書きされ消去されます。続行しますか?'
						) === false
					) {
						reject(new CSVError('CSV_IMPORT_CANCELED', 'インポートがキャンセルされました'));
						return;
					}
				}

				const REQUIRED_FIELDS = [
					'start',
					'lyric',
					'duration',
					'monitor',
					'type',
					'color',
					'content',
					'left',
					'backOne',
					'backTwo',
					'backThree',
					'backFour',
					'backFive',
					'backSix',
					'right'
				] as const;

				const fields = results.meta.fields ?? [];

				const hasInvalidFields = REQUIRED_FIELDS.some((field) => !fields.includes(field));

				if (hasInvalidFields) {
					reject(
						new CSVError(
							'CSV_FORMAT_ERROR',
							'アップロードされたCSVファイルのフォーマットが間違っています'
						)
					);
					return;
				}

				const rows = results.data as Row[];
				const validRows = rows.map((row) => ({
					id: row.id || crypto.randomUUID(),
					start: row.start || 0,
					lyric: row.lyric || '',
					duration: row.duration || 0,
					monitor: row.monitor || '',
					type: row.type || '',
					color: row.color || '#fde047',
					content: row.content || '',
					left: row.left || '',
					backOne: row.backOne || '',
					backTwo: row.backTwo || '',
					backThree: row.backThree || '',
					backFour: row.backFour || '',
					backFive: row.backFive || '',
					backSix: row.backSix || '',
					right: row.right || ''
				}));

				if (validRows.length === 0) {
					editorState.addRow();
				}

				resolve(validRows);
			},
			error: (error) =>
				reject(new CSVError('CSV_IMPORT_ERROR', error.message || 'CSVのインポートに失敗しました'))
		});
	});
}
