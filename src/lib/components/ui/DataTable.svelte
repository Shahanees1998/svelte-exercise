<script lang="ts">
	export let columns: Array<{key: string, label: string, sortable?: boolean}>;
	export let data: any[];
	export let actions: Array<{label: string, class: string, onClick: (item: any) => void}>;
	export let emptyMessage = "No data found";
	export let emptyIcon = "📋";
	export let isLoading = false;
	export let loadingMessage = "Loading...";

	function handleActionClick(action: any, item: any) {
		action.onClick(item);
	}
</script>

<div class="content-card">
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>{loadingMessage}</p>
		</div>
	{:else if data.length === 0}
		<div class="empty-state">
			<div class="empty-icon">{emptyIcon}</div>
			<h3>No data found</h3>
			<p>{emptyMessage}</p>
		</div>
	{:else}
		<!-- Desktop Table View -->
		<div class="table-container desktop-table">
			<table class="data-table">
				<thead>
					<tr>
						{#each columns as column}
							<th>{column.label}</th>
						{/each}
						{#if actions.length > 0}
							<th>Actions</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each data as item (item.id)}
						<tr>
							{#each columns as column}
								<td class="data-cell">
									{@html item[column.key]}
								</td>
							{/each}
							{#if actions.length > 0}
								<td class="actions">
									{#each actions as action}
										<button 
											class="btn btn-sm {action.class}" 
											on:click={() => handleActionClick(action, item)}
										>
											{action.label}
										</button>
									{/each}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile Card View -->
		<div class="mobile-cards">
			{#each data as item (item.id)}
				<div class="data-card">
					<div class="data-card-content">
						{#each columns as column}
							<div class="data-card-row">
								<div class="data-card-label">{column.label}</div>
								<div class="data-card-value">{@html item[column.key]}</div>
							</div>
						{/each}
					</div>
					{#if actions.length > 0}
						<div class="data-card-actions">
							{#each actions as action}
								<button 
									class="btn btn-sm {action.class}" 
									on:click={() => handleActionClick(action, item)}
								>
									{action.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>