<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Product } from '$lib/server/data';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	
	let { data }: { data: PageData } = $props();
	
	let showAddDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedProduct = $state<Product | null>(null);
	
	// Form state
	let formName = $state('');
	let formDescription = $state('');
	let formPrice = $state(0);
	let formCategory = $state('electronics');
	let formStock = $state(0);
	let formStatus = $state<'active' | 'inactive'>('active');
	
	function handleSearch(e: Event) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;
		
		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function clearSearch() {
		const url = new URL($page.url);
		url.searchParams.delete('search');
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function openAddDialog() {
		formName = '';
		formDescription = '';
		formPrice = 0;
		formCategory = 'electronics';
		formStock = 0;
		formStatus = 'active';
		showAddDialog = true;
	}
	
	function openEditDialog(product: Product) {
		selectedProduct = product;
		formName = product.name;
		formDescription = product.description;
		formPrice = product.price;
		formCategory = product.category;
		formStock = product.stock;
		formStatus = product.status;
		showEditDialog = true;
	}
	
	function openDeleteDialog(product: Product) {
		selectedProduct = product;
		showDeleteDialog = true;
	}
	
	function handleAddProduct() {
		if (!formName || !formDescription) {
			toast.error('Please fill in all required fields');
			return;
		}
		
		// In a real app, this would call an API endpoint
		showAddDialog = false;
		toast.success('Product added successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function handleEditProduct() {
		if (!selectedProduct || !formName || !formDescription) {
			toast.error('Please fill in all required fields');
			return;
		}
		
		// In a real app, this would call an API endpoint
		showEditDialog = false;
		toast.success('Product updated successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function handleDeleteProduct() {
		if (!selectedProduct) return;
		
		// In a real app, this would call an API endpoint
		showDeleteDialog = false;
		toast.success('Product deleted successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function formatPrice(price: number) {
		return `$${price.toFixed(2)}`;
	}
</script>

<svelte:head>
	<title>Products - Dashboard</title>
</svelte:head>

<div class="page-header">
	<div>
		<h1>Products</h1>
		<p>Manage your product inventory</p>
	</div>
	<button class="btn btn-primary" onclick={openAddDialog}>
		+ Add Product
	</button>
</div>

<!-- Search Form -->
<form class="search-section" onsubmit={handleSearch}>
	<div class="search-container">
		<input
			type="search"
			name="search"
			class="form-input"
			placeholder="Search products..."
			value={data.search}
		/>
		<button type="submit" class="btn btn-primary btn-sm">
			🔍 Search
		</button>
		{#if data.search}
			<button type="button" class="btn btn-secondary btn-sm" onclick={clearSearch}>
				Clear
			</button>
		{/if}
	</div>
</form>

<!-- Products Table -->
<div class="card">
	{#if data.products.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📦</div>
			<h3>No products found</h3>
			<p>{data.search ? 'Try a different search term' : 'Add your first product to get started'}</p>
		</div>
	{:else}
		<div class="table-container">
			<table class="data-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Category</th>
						<th>Stock</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.products as product (product.id)}
						<tr>
							<td>{product.id}</td>
							<td><strong>{product.name}</strong></td>
							<td>{product.description.length > 50 ? product.description.slice(0, 50) + '...' : product.description}</td>
							<td>{formatPrice(product.price)}</td>
							<td><span class="badge">{product.category}</span></td>
							<td>{product.stock}</td>
							<td><span class="badge status-{product.status}">{product.status}</span></td>
							<td>
								<div class="flex gap-sm">
									<button 
										class="btn btn-sm btn-secondary" 
										onclick={() => openEditDialog(product)}
									>
										✏️ Edit
									</button>
									<button 
										class="btn btn-sm btn-danger" 
										onclick={() => openDeleteDialog(product)}
									>
										🗑️ Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Add Product Dialog -->
<Dialog bind:open={showAddDialog} title="Add New Product">
	{#snippet children()}
		<form onsubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
			<div class="form-group">
				<label for="add-name">Product Name *</label>
				<input
					id="add-name"
					type="text"
					class="form-input"
					bind:value={formName}
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="add-description">Description *</label>
				<textarea
					id="add-description"
					class="form-textarea"
					bind:value={formDescription}
					required
				></textarea>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="add-price">Price ($) *</label>
					<input
						id="add-price"
						type="number"
						class="form-input"
						bind:value={formPrice}
						min="0"
						step="0.01"
						required
					/>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="add-stock">Stock *</label>
					<input
						id="add-stock"
						type="number"
						class="form-input"
						bind:value={formStock}
						min="0"
						required
					/>
				</div>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="add-category">Category *</label>
					<select
						id="add-category"
						class="form-select"
						bind:value={formCategory}
						required
					>
						<option value="electronics">Electronics</option>
						<option value="clothing">Clothing</option>
						<option value="home">Home</option>
						<option value="books">Books</option>
						<option value="sports">Sports</option>
					</select>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="add-status">Status *</label>
					<select
						id="add-status"
						class="form-select"
						bind:value={formStatus}
						required
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			
			<div class="dialog-footer">
				<button type="button" class="btn btn-secondary" onclick={() => showAddDialog = false}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary">
					Add Product
				</button>
			</div>
		</form>
	{/snippet}
</Dialog>

<!-- Edit Product Dialog -->
<Dialog bind:open={showEditDialog} title="Edit Product">
	{#snippet children()}
		<form onsubmit={(e) => { e.preventDefault(); handleEditProduct(); }}>
			<div class="form-group">
				<label for="edit-name">Product Name *</label>
				<input
					id="edit-name"
					type="text"
					class="form-input"
					bind:value={formName}
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="edit-description">Description *</label>
				<textarea
					id="edit-description"
					class="form-textarea"
					bind:value={formDescription}
					required
				></textarea>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="edit-price">Price ($) *</label>
					<input
						id="edit-price"
						type="number"
						class="form-input"
						bind:value={formPrice}
						min="0"
						step="0.01"
						required
					/>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="edit-stock">Stock *</label>
					<input
						id="edit-stock"
						type="number"
						class="form-input"
						bind:value={formStock}
						min="0"
						required
					/>
				</div>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="edit-category">Category *</label>
					<select
						id="edit-category"
						class="form-select"
						bind:value={formCategory}
						required
					>
						<option value="electronics">Electronics</option>
						<option value="clothing">Clothing</option>
						<option value="home">Home</option>
						<option value="books">Books</option>
						<option value="sports">Sports</option>
					</select>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="edit-status">Status *</label>
					<select
						id="edit-status"
						class="form-select"
						bind:value={formStatus}
						required
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			
			<div class="dialog-footer">
				<button type="button" class="btn btn-secondary" onclick={() => showEditDialog = false}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary">
					Update Product
				</button>
			</div>
		</form>
	{/snippet}
</Dialog>

<!-- Delete Product Dialog -->
<Dialog bind:open={showDeleteDialog} title="Delete Product">
	{#snippet children()}
		<p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
		<p>This action cannot be undone.</p>
		
		<div class="dialog-footer">
			<button class="btn btn-secondary" onclick={() => showDeleteDialog = false}>
				Cancel
			</button>
			<button class="btn btn-danger" onclick={handleDeleteProduct}>
				Delete Product
			</button>
		</div>
	{/snippet}
</Dialog>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-xl);
		gap: var(--space-md);
	}
	
	.page-header h1 {
		margin-bottom: var(--space-xs);
	}
	
	.page-header p {
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	.search-section {
		margin-bottom: var(--space-xl);
	}
	
	.search-container {
		display: flex;
		gap: var(--space-sm);
		max-width: 600px;
	}
	
	.empty-state {
		text-align: center;
		padding: var(--space-2xl) var(--space-xl);
		color: var(--color-text-secondary);
	}
	
	.empty-icon {
		font-size: 4rem;
		margin-bottom: var(--space-md);
		opacity: 0.5;
	}
	
	.empty-state h3 {
		margin-bottom: var(--space-sm);
		color: var(--color-text-primary);
	}
	
	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
		}
		
		.page-header button {
			width: 100%;
		}
		
		.search-container {
			flex-wrap: wrap;
			max-width: none;
		}
		
		.search-container input {
			flex: 1 1 100%;
		}
	}
</style>
