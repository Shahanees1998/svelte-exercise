<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import '../app.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="description" content="Modern E-Commerce Dashboard built with SvelteKit 5" />
</svelte:head>

<slot />
<ToastContainer />
