export class MediaUploader {
	static readLocalFile(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				const dataUrl = event.target?.result as string;
				resolve(dataUrl);
			};

			reader.onerror = () => {
				reject(new Error('ファイル読み込み失敗'));
			};

			reader.readAsDataURL(file);
		});
	}
	static createBlobUrl(file: File): string {
		return URL.createObjectURL(file);
	}
	static revokeBlobUrl(url: string) {
		URL.revokeObjectURL(url);
	}
	static isValidMediaFile(file: File): boolean {
		const validTypes = [
			'video/mp4',
			'video/webm',
			'video/ogg', // 動画
			'audio/mpeg',
			'audio/wav',
			'audio/ogg' // 音声
		];
		return validTypes.includes(file.type);
	}
}
