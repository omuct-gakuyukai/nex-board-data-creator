export function parseFileName(filename: string): { groupName: string; songName: string } | null {
	if (!filename.endsWith('.csv')) {
		return null;
	}

	const baseName = filename.toLowerCase().replace(/\.csv$/i, '');

	const lastUnderscoreIndex = baseName.lastIndexOf('__');
	if (lastUnderscoreIndex === -1) {
		return null;
	}

	const groupName = baseName.substring(0, lastUnderscoreIndex);
	const songName = baseName.substring(lastUnderscoreIndex + 1).replace(/_/, '');

	if (!groupName || !songName) {
		return null;
	}

	return { groupName, songName };
}

export function hasValidFileNamePart(s: string): boolean {
	const hasInvalidChar = /[^a-zA-Z0-9_().-]/;
	return hasInvalidChar.test(s);
}
