<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let isOpen = false;
	export let title = 'Delete Item';
	export let itemName = '';
	export let itemType = 'item';
	export let isLoading = false;
	
	const dispatch = createEventDispatcher();
	
	function handleClose() {
		dispatch('close');
	}
	
	function handleConfirm() {
		dispatch('confirm');
	}
</script>

{#if isOpen}
	<div class="modal-overlay" on:click={handleClose}>
		<div class="modal modal-sm" on:click|stopPropagation>
			<div class="modal-header">
				<h2>{title}</h2>
				<button class="modal-close" on:click={handleClose}>×</button>
			</div>
			<div class="modal-body">
				<p>Are you sure you want to delete {itemType} <strong>{itemName}</strong>? This action cannot be undone.</p>
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" on:click={handleClose} disabled={isLoading}>
						Cancel
					</button>
					<button type="button" class="btn btn-danger" on:click={handleConfirm} disabled={isLoading}>
						{#if isLoading}
							Deleting...
						{:else}
							Delete {itemType}
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
