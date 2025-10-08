<script lang="ts">
	export let icon: string = '📊';
	export let title: string = 'No data available';
	export let message: string = 'Start by adding some data to see your dashboard statistics.';
	export let actionLabel: string | undefined = undefined;
	export let onAction: (() => void) | undefined = undefined;
</script>

<div class="empty-state-container">
	<div class="empty-state-content">
		<div class="empty-icon">{icon}</div>
		<h3>{title}</h3>
		<p>{message}</p>
		{#if actionLabel && onAction}
			<button class="btn btn-primary" on:click={onAction}>
				{actionLabel}
			</button>
		{/if}
	</div>
</div>

