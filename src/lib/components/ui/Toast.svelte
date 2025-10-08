<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { onMount } from 'svelte';

	export let toastItem: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'; duration?: number };

	function handleClose() {
		toast.remove(toastItem.id);
	}

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✕';
			case 'warning':
				return '⚠';
			case 'info':
				return 'ℹ';
			default:
				return 'ℹ';
		}
	}
</script>

<div class="toast toast-{toastItem.type}" role="alert">
	<div class="toast-content">
		<span class="toast-icon">{getIcon(toastItem.type)}</span>
		<span class="toast-message">{toastItem.message}</span>
	</div>
	<button class="toast-close" on:click={handleClose} aria-label="Close notification">
		×
	</button>
</div>

