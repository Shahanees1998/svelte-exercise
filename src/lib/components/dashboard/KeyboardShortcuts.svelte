<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let enabled = true;

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (!enabled) return;

		function handleKeyPress(event: KeyboardEvent) {
			// Cmd/Ctrl + R: Refresh
			if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
				event.preventDefault();
				dispatch('refresh');
			}

			// Press '?' to show help
			if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
				dispatch('showHelp');
			}
		}

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});
</script>

<!-- This component has no visual output, it just handles keyboard shortcuts -->

