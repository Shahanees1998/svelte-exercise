<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	
	onMount(() => {
		if (authStore.isAuthenticated) {
			goto('/dashboard/overview');
		} else {
			goto('/login');
		}
	});
</script>

<div class="loading-container">
	<div class="loading-spinner"></div>
	<p>Loading...</p>
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: var(--gradient-primary);
		color: white;
	}
	
	.loading-container p {
		margin-top: var(--space-md);
		font-size: var(--font-size-lg);
	}
</style>
