import type { Row } from '$lib/types/csv';
class CsvStore {
	rows = $state<Row[]>([]);
	columns = [
		'start',
		'length',
		'monitor',
		'type',
		'content',
		'right',
		'left',
		'foot',
		'back'
	] as const;

	focusedIndex = $state<number | null>(null);

	constructor() {
		this.rows = [this.createEmptyRow()];
	}

	private createEmptyRow(): Row {
		return {
			id: crypto.randomUUID(),
			start: '',
			length: '',
			monitor: '',
			type: '',
			content: '',
			right: '',
			left: '',
			foot: '',
			back: ''
		};
	}

	addRow() {
		const newRow = this.createEmptyRow();
		if (this.focusedIndex !== null) {
			this.rows.splice(this.focusedIndex + 1, 0, newRow);
			this.focusedIndex = this.focusedIndex + 1;
		} else {
			this.rows.push(newRow);
		}
	}
}
export const csvStore = new CsvStore();
