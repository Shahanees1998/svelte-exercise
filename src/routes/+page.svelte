<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';

	onMount(() => {
		// Check if user is already authenticated
		const unsubscribe = authStore.subscribe(state => {
			if (state.isAuthenticated) {
				goto('/dashboard');
			} else {
				goto('/login');
			}
		});

		return unsubscribe;
	});
</script>

<div class="loading-container">
	<div class="loading-spinner"></div>
	<p>Loading...</p>
</div>

