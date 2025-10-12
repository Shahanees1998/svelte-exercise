<script lang="ts">
	interface Action {
		label: string;
		icon?: string;
		variant?: 'primary' | 'secondary' | 'danger' | 'info';
		onclick: () => void;
		disabled?: boolean;
		'aria-label'?: string;
	}

	interface Props {
		actions: Action[];
		size?: 'sm' | 'md' | 'lg';
	}

	let { actions, size = 'sm' }: Props = $props();
</script>

<div class="action-buttons" role="group" aria-label="Row actions">
	{#each actions as action}
		<button 
			class="btn btn-{action.variant || 'secondary'} btn-{size}"
			onclick={action.onclick}
			disabled={action.disabled}
			aria-label={action['aria-label'] || action.label}
		>
			{#if action.icon}
				<span class="action-icon" aria-hidden="true">{action.icon}</span>
			{/if}
			{action.label}
		</button>
	{/each}
</div>

<!-- All styles moved to app.css -->
