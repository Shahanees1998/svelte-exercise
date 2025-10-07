<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to overview page
		goto('/dashboard/overview');
	});
</script>

<svelte:head>
	<title>Dashboard - E-Commerce Dashboard</title>
</svelte:head>

<div class="loading-container">
	<div class="loading-spinner"></div>
	<p>Loading...</p>
</div>

