<script lang="ts">
	import { onMount } from 'svelte';
	import { productsStore, type Product } from '$lib/stores/data';
	import { createEventDispatcher } from 'svelte';

	export let selectedProduct: Product | null = null;
	export let idPrefix: string = 'product';

	const dispatch = createEventDispatcher();

	let products: Product[] = [];
	let searchTerm = '';
	let filteredProducts: Product[] = [];
	let isOpen = false;
	let inputElement: HTMLInputElement;

	// Subscribe to products store
	const unsubscribe = productsStore.subscribe(value => {
		products = value.filter(p => p.status === 'active' && p.stock > 0);
		filterProducts();
	});

	onMount(() => {
		return () => {
			unsubscribe();
		};
	});

	function filterProducts() {
		if (!searchTerm.trim()) {
			filteredProducts = products;
		} else {
			filteredProducts = products.filter(product =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.category.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
	}

	function handleInput() {
		filterProducts();
		isOpen = true;
	}

	function selectProduct(product: Product) {
		selectedProduct = product;
		searchTerm = product.name;
		isOpen = false;
		dispatch('select', { product });
	}

	function handleFocus() {
		isOpen = true;
		filterProducts();
	}

	function handleBlur() {
		// Delay to allow click on dropdown item
		setTimeout(() => {
			isOpen = false;
		}, 200);
	}

	function clearSelection() {
		selectedProduct = null;
		searchTerm = '';
		filterProducts();
		inputElement?.focus();
		dispatch('clear');
	}
</script>

<div class="product-search-dropdown">
	<div class="search-input-wrapper">
		<input
			bind:this={inputElement}
			id="{idPrefix}-search"
			type="text"
			class="form-input"
			bind:value={searchTerm}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			placeholder="Search products..."
			autocomplete="off"
		/>
		{#if selectedProduct}
			<button
				type="button"
				class="clear-btn"
				on:click={clearSelection}
				title="Clear selection"
			>×</button>
		{/if}
	</div>

	{#if isOpen && filteredProducts.length > 0}
		<div class="dropdown-menu">
			{#each filteredProducts as product}
				<button
					type="button"
					class="dropdown-item"
					on:click={() => selectProduct(product)}
				>
					<div class="product-info">
						<span class="product-name">{product.name}</span>
						<span class="product-meta">
							{product.category.charAt(0).toUpperCase() + product.category.slice(1)} • 
							${product.price} • 
							Stock: {product.stock}
						</span>
					</div>
				</button>
			{/each}
		</div>
	{:else if isOpen && searchTerm && filteredProducts.length === 0}
		<div class="dropdown-menu">
			<div class="no-results">No products found</div>
		</div>
	{/if}
</div>

<style>
	.product-search-dropdown {
		position: relative;
		width: 100%;
	}

	.search-input-wrapper {
		position: relative;
	}

	.clear-btn {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		background: #e5e7eb;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 18px;
		color: #6b7280;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: #d1d5db;
		color: #374151;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-height: 250px;
		overflow-y: auto;
		z-index: 100;
	}

	.dropdown-item {
		width: 100%;
		padding: 12px 16px;
		border: none;
		background: white;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
		border-bottom: 1px solid #f3f4f6;
	}

	.dropdown-item:last-child {
		border-bottom: none;
	}

	.dropdown-item:hover {
		background-color: #f9fafb;
	}

	.product-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.product-name {
		font-weight: 500;
		color: #111827;
	}

	.product-meta {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.no-results {
		padding: 12px 16px;
		text-align: center;
		color: #6b7280;
		font-size: 0.875rem;
	}
</style>

