<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let isOpen = false;
	export let title = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let showCloseButton = true;
	
	const dispatch = createEventDispatcher();
	
	function handleClose() {
		dispatch('close');
	}
	
	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}
</script>

{#if isOpen}
	<div class="modal-overlay" on:click={handleOverlayClick}>
		<div class="modal modal-{size}" on:click|stopPropagation>
			<div class="modal-header">
				<h2>{title}</h2>
				{#if showCloseButton}
					<button class="modal-close" on:click={handleClose}>×</button>
				{/if}
			</div>
			<div class="modal-body">
				<slot />
			</div>
		</div>
	</div>
{/if}