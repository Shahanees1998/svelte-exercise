<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

<div class="toast-container">
	{#each $toast as toastItem (toastItem.id)}
		<Toast {toastItem} />
	{/each}
</div>

