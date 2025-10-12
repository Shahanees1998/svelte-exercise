<script lang="ts">
	import type { Snippet } from 'svelte';

	interface FilterOption {
		name: string;
		value: string;
		label: string;
	}

	interface Props {
		searchValue?: string;
		placeholder?: string;
		filters?: FilterOption[];
		filterValue?: string;
		filterName?: string;
		onSearch: (search: string, filter?: string) => void;
		onClear: () => void;
		children?: Snippet;
	}

	let { 
		searchValue = '', 
		placeholder = 'Search...', 
		filters = [],
		filterValue = '',
		filterName = 'filter',
		onSearch,
		onClear,
		children 
	}: Props = $props();

	function handleSubmit(e: Event) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;
		const filter = formData.get(filterName) as string;
		onSearch(search, filter);
	}

	function handleClear() {
		onClear();
	}
</script>

<form class="search-bar" onsubmit={handleSubmit}>
	<div class="search-container">
		<input
			type="search"
			name="search"
			class="form-input"
			placeholder={placeholder}
			value={searchValue}
		/>
		
		{#if filters.length > 0}
			<select name={filterName} class="form-select" value={filterValue}>
				<option value="">All</option>
				{#each filters as filter}
					<option value={filter.value}>{filter.label}</option>
				{/each}
			</select>
		{/if}
		
		<button type="submit" class="btn btn-primary btn-sm">
			🔍 Search
		</button>
		
		{#if searchValue || filterValue}
			<button type="button" class="btn btn-secondary btn-sm" onclick={handleClear}>
				Clear
			</button>
		{/if}
	</div>
	
	{#if children}
		<div class="search-extra">
			{@render children()}
		</div>
	{/if}
</form>

<!-- All styles moved to app.css -->
