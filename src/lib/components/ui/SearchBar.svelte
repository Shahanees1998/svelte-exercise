<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let placeholder: string = 'Search...';
	export let value: string = '';
	export let showFilter: boolean = false;
	export let filterOptions: { value: string; label: string }[] = [];
	export let filterValue: string = '';

	const dispatch = createEventDispatcher();

	function handleSearch() {
		dispatch('search', { searchTerm: value, filterValue });
	}

	function handleInput() {
		dispatch('input', { searchTerm: value, filterValue });
	}

	function handleFilterChange() {
		dispatch('filter', { searchTerm: value, filterValue });
	}
</script>

<div class="search-section">
	<div class="search-container">
		<input
			type="text"
			class="search-input"
			{placeholder}
			bind:value={value}
			on:input={handleInput}
		/>
		<button class="search-button" on:click={handleSearch}>
			<span class="search-icon">🔍</span>
		</button>
	</div>
	{#if showFilter && filterOptions.length > 0}
		<div class="filter-container">
			<select class="filter-select" bind:value={filterValue} on:change={handleFilterChange}>
				<option value="">All</option>
				{#each filterOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	{/if}
</div>
