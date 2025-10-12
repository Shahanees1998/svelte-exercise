<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		width?: string;
	}

	interface Props<T = any> {
		columns: Column[];
		data: T[];
		keyField: keyof T;
		emptyMessage?: string;
		emptyIcon?: string;
		emptyDescription?: string;
		rowSnippet: Snippet<[T]>;
		loading?: boolean;
	}

	let { 
		columns, 
		data, 
		keyField, 
		emptyMessage = 'No data found',
		emptyIcon = '📋',
		emptyDescription,
		rowSnippet,
		loading = false
	}: Props = $props();
</script>

<section class="data-table-container">
	{#if loading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading...</p>
		</div>
	{:else if data.length === 0}
		<div class="empty-state">
			<div class="empty-icon" aria-hidden="true">{emptyIcon}</div>
			<h3>{emptyMessage}</h3>
			{#if emptyDescription}
				<p>{emptyDescription}</p>
			{/if}
		</div>
	{:else}
		<div class="table-wrapper">
			<table class="data-table" role="table">
				<thead>
					<tr>
						{#each columns as column}
							<th 
								scope="col" 
								style={column.width ? `width: ${column.width}` : ''}
							>
								{column.label}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data as item (item[keyField])}
						{@render rowSnippet(item)}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<!-- All styles moved to app.css -->
