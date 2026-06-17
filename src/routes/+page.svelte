<script lang="ts">
	import CSVEditor from '$lib/components/CSVEditor.svelte';
	import Header from '$lib/components/Header.svelte';
	import Player from '$lib/components/Player.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import Property from '$lib/components/Property.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import Timer from '$lib/components/Timer.svelte';
</script>

<Header />
<div class="flex">
	<Property />
	<Timer />
</div>

<Preview />

<div class="mx-7 my-2 flex">
	<div class="flex flex-col">
		<Stage />
		<Player />
	</div>
	<CSVEditor />
</div>
