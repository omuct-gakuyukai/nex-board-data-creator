export function parseFileName(filename: string): { groupName: string; songName: string } | null {
	if (!filename.endsWith('.csv')) {
		return null;
	}

	const baseName = filename.replace(/.csv$/, '');

	const lastUnderscoreIndex = baseName.lastIndexOf('_');
	if (lastUnderscoreIndex === -1) {
		return null;
	}

	const groupName = baseName.substring(0, lastUnderscoreIndex);
	const songName = baseName.substring(lastUnderscoreIndex + 1);

	if (!groupName || !songName) {
		return null;
	}

	return { groupName, songName };
}
