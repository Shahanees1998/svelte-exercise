<script lang="ts">
	interface Props {
		icon?: string;
		title: string;
		description?: string;
		action?: {
			label: string;
			onclick: () => void;
		};
	}

	let { icon = '📋', title, description, action }: Props = $props();
</script>

<div class="empty-state">
	<div class="empty-icon" aria-hidden="true">{icon}</div>
	<h3>{title}</h3>
	{#if description}
		<p>{description}</p>
	{/if}
	{#if action}
		<button class="btn btn-primary" onclick={action.onclick}>
			{action.label}
		</button>
	{/if}
</div>

<!-- All styles moved to app.css -->
