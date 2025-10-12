<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		actionButton?: {
			label: string;
			onclick: () => void;
			variant?: 'primary' | 'secondary' | 'danger';
		};
		children?: Snippet;
	}

	let { title, description, actionButton, children }: Props = $props();
</script>

<header class="page-header">
	<div class="page-header-content">
		<div>
			<h1>{title}</h1>
			{#if description}
				<p>{description}</p>
			{/if}
		</div>
		{#if actionButton}
			<button 
				class="btn btn-{actionButton.variant || 'primary'}" 
				onclick={actionButton.onclick}
			>
				{actionButton.label}
			</button>
		{/if}
	</div>
	{#if children}
		<div class="page-header-extra">
			{@render children()}
		</div>
	{/if}
</header>

<!-- All styles moved to app.css -->
