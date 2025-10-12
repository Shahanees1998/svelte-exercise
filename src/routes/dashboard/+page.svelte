<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/dashboard/overview');
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

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
		min-height: 50vh;
	}
</style>
