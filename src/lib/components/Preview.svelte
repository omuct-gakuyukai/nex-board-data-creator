<!--
<div class="flex justify-center px-13">
	<div class="flex flex-col">
		<div class="flex">
			<div class="mx-1 h-45 w-80 border bg-gray-400 text-4xl">Placeholder</div>
			<div class="mx-1 h-45 w-80 border bg-gray-400 text-4xl">Placeholder</div>
		</div>
		<div class="mx-auto my-2 max-w-fit bg-gray-300 px-25 py-2">sub</div>
	</div>
	<div class="flex flex-col">
		<div class="flex">
			<div class="mx-1 h-45 w-80 border bg-gray-400 text-4xl">Placeholder</div>
			<div class="mx-1 h-45 w-80 border bg-gray-400 text-4xl">Placeholder</div>
			<div class="mx-1 h-45 w-80 border bg-gray-400 text-4xl">Placeholder</div>
		</div>
		<div class="mx-auto my-2 max-w-fit bg-gray-300 px-60 py-2">main</div>
	</div>
</div>
-->

<script lang="ts">
	import { onMount } from 'svelte';

	type NexBoardWasm = {
		default: () => Promise<void>;
		init: (instanceId: string, canvasId: string, configJson: string) => Promise<void>;
		send_command: (instanceId: string, json: string) => void;
	};

	let wasmModule: NexBoardWasm | null = null;

	// 5つのcanvas参照
	let main1Canvas: HTMLCanvasElement;
	let main2Canvas: HTMLCanvasElement;
	let main3Canvas: HTMLCanvasElement;
	let sub1Canvas: HTMLCanvasElement;
	let sub2Canvas: HTMLCanvasElement;
	const defaultConfigJson = JSON.stringify({
		text_size: 1080,
		window_width: 1920,
		camera_offset: 0
	});

	onMount(async () => {
		const wasm = await import('../nex-board/pkg/nex_board.js');
		await wasm.default();
		wasmModule = wasm as unknown as NexBoardWasm;

		// 5つのインスタンスを初期化
		await wasmModule.init('main1', 'main1-canvas', defaultConfigJson);
		await wasmModule.init('main2', 'main2-canvas', defaultConfigJson);
		await wasmModule.init('main3', 'main3-canvas', defaultConfigJson);
		await wasmModule.init('sub1', 'sub1-canvas', defaultConfigJson);
		await wasmModule.init('sub2', 'sub2-canvas', defaultConfigJson);

		// 各インスタンスに異なるテキストを送信
		sendTextToAll();
	});

	function sendTextToAll() {
		const module = wasmModule;
		if (!module) return;

		// メイン3枚に異なるテキスト
		module.send_command(
			'main1',
			JSON.stringify({
				mode: 'bulletin',
				preset: 'default',
				index: 0
			})
		);
		module.send_command(
			'main2',
			JSON.stringify({
				mode: 'bulletin',
				preset: 'default',
				index: 1
			})
		);
		module.send_command(
			'main3',
			JSON.stringify({
				mode: 'bulletin',
				preset: 'default',
				index: 2
			})
		);

		// サブ2枚に異なるテキスト
		module.send_command(
			'sub1',
			JSON.stringify({
				mode: 'bulletin',
				preset: 'default',
				index: 3
			})
		);
		module.send_command(
			'sub2',
			JSON.stringify({
				mode: 'bulletin',
				preset: 'default',
				index: 4
			})
		);
	}
</script>

<div class="px-10">
	<div class="container">
		<div class="main-displays">
			<h2>メイン (3枚)</h2>
			<div class="display-row">
				<canvas bind:this={main1Canvas} id="main1-canvas" width="1920" height="1080"></canvas>
				<canvas bind:this={main2Canvas} id="main2-canvas" width="1920" height="1080"></canvas>
				<canvas bind:this={main3Canvas} id="main3-canvas" width="1920" height="1080"></canvas>
			</div>
		</div>

		<div class="sub-displays ml-5">
			<h2>サブ (2枚)</h2>
			<div class="display-row">
				<canvas bind:this={sub1Canvas} id="sub1-canvas" width="1920" height="1080"></canvas>
				<canvas bind:this={sub2Canvas} id="sub2-canvas" width="1920" height="1080"></canvas>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 20px;
	}

	.display-row {
		display: flex;
		gap: 10px;
	}

	canvas {
		width: 320px;
		height: 180px;
		background: #1e1e1e;
	}
</style>
