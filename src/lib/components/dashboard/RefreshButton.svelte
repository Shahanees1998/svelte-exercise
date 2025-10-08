<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isRefreshing = false;
	export let lastUpdated: Date | null = null;

	const dispatch = createEventDispatcher();

	function handleRefresh() {
		dispatch('refresh');
	}

	function formatLastUpdated(date: Date | null): string {
		if (!date) return 'Never';
		
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (seconds < 60) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return date.toLocaleDateString();
	}
</script>

<div class="refresh-container">
	<button 
		class="btn btn-secondary btn-sm refresh-btn" 
		on:click={handleRefresh}
		disabled={isRefreshing}
		aria-label="Refresh dashboard data"
	>
		<span class="refresh-icon" class:spinning={isRefreshing}>🔄</span>
		{isRefreshing ? 'Refreshing...' : 'Refresh'}
	</button>
	{#if lastUpdated}
		<span class="last-updated">
			Updated: {formatLastUpdated(lastUpdated)}
		</span>
	{/if}
</div>

