<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let searchPlaceholder = "Search...";
	export let searchValue = '';
	export let isSearching = false;
	export let filters: Array<{key: string, label: string, options: Array<{value: string, label: string}>}> = [];
	export let filterValues: Record<string, string> = {};
	
	const dispatch = createEventDispatcher();
	
	function handleSearch() {
		dispatch('search', { value: searchValue });
	}
	
	function handleFilterChange(filterKey: string, value: string) {
		filterValues[filterKey] = value;
		dispatch('filter', { key: filterKey, value });
	}
</script>

<div class="search-section">
	<div class="search-container">
		<input
			type="text"
			class="search-input"
			placeholder={searchPlaceholder}
			bind:value={searchValue}
			on:input={handleSearch}
		/>
		<button class="search-button" on:click={handleSearch}>
			{#if isSearching}
				<span class="search-icon searching">⏳</span>
			{:else}
				<span class="search-icon">🔍</span>
			{/if}
		</button>
	</div>
	
	{#if filters.length > 0}
		<div class="filter-row">
			{#each filters as filter}
				<div class="filter-container">
					<select 
						class="filter-select" 
						bind:value={filterValues[filter.key]}
						on:change={() => handleFilterChange(filter.key, filterValues[filter.key])}
					>
						<option value="">All {filter.label}</option>
						{#each filter.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			{/each}
		</div>
	{/if}
</div>
