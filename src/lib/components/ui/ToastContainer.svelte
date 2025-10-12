<script lang="ts">
	import { toast } from '$lib/stores/toast.svelte';
	
	const iconMap = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};
</script>

<div class="toast-container">
	{#each toast.toasts as item (item.id)}
		<div class="toast toast-{item.type}">
			<div class="toast-content">
				<span class="toast-icon">{iconMap[item.type]}</span>
				<span class="toast-message">{item.message}</span>
			</div>
			<button 
				class="toast-close" 
				onclick={() => toast.remove(item.id)}
				aria-label="Close"
			>
				×
			</button>
		</div>
	{/each}
</div>
