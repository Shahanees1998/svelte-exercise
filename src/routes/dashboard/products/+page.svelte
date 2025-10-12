<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Product } from '$lib/types';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ActionButtons from '$lib/components/ui/ActionButtons.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import ProductForm from '$lib/components/forms/ProductForm.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { productColumns } from '$lib/utils/tableConfigs';
	import { formatPrice, truncateText } from '$lib/utils/formatters';
	
	let { data }: { data: PageData } = $props();
	
	let showAddDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedProduct = $state<Product | null>(null);
	
	function handleFormSuccess(message?: string) {
		showAddDialog = false;
		showEditDialog = false;
		showDeleteDialog = false;
		selectedProduct = null;
		toast.success(message || 'Operation successful');
	}
	
	function handleFormError(error: string) {
		toast.error(error);
	}
	
	function handleSearch(search: string) {
		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function clearSearch() {
		goto('/dashboard/products', { keepFocus: true, noScroll: true });
	}
	
	function openAddDialog() {
		selectedProduct = null;
		showAddDialog = true;
	}
	
	function openEditDialog(product: Product) {
		selectedProduct = product;
		showEditDialog = true;
	}
	
	function openDeleteDialog(product: Product) {
		selectedProduct = product;
		showDeleteDialog = true;
	}
</script>

<svelte:head>
	<title>Products - Dashboard</title>
</svelte:head>

<PageHeader 
	title="Products" 
	description="Manage your product inventory"
	actionButton={{
		label: "+ Add Product",
		onclick: openAddDialog
	}}
/>

<SearchBar 
	searchValue={data.search}
	placeholder="Search products..."
	onSearch={handleSearch}
	onClear={clearSearch}
/>

<DataTable 
	columns={productColumns}
	data={data.products}
	keyField="id"
	emptyMessage="No products found"
	emptyIcon="📦"
	emptyDescription={data.search ? 'Try a different search term' : 'Add your first product to get started'}
>
	{#snippet rowSnippet(product)}
		<tr>
			<td>{product.id}</td>
			<td><strong>{product.name}</strong></td>
			<td>{truncateText(product.description, 50)}</td>
			<td>{formatPrice(product.price)}</td>
			<td><StatusBadge status={product.category} type="category" /></td>
			<td>{product.stock}</td>
			<td><StatusBadge status={product.status} type="status" /></td>
			<td>
				<ActionButtons 
					actions={[
						{
							label: "Edit",
							icon: "✏️",
							variant: "secondary",
							onclick: () => openEditDialog(product),
							'aria-label': `Edit ${product.name}`
						},
						{
							label: "Delete",
							icon: "🗑️",
							variant: "danger",
							onclick: () => openDeleteDialog(product),
							'aria-label': `Delete ${product.name}`
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

{#if data.pagination.totalPages > 1}
	<Pagination 
		currentPage={data.pagination.currentPage}
		totalPages={data.pagination.totalPages}
		totalItems={data.pagination.totalItems}
		itemsPerPage={data.pagination.itemsPerPage}
		itemName="products"
	/>
{/if}

<Dialog bind:open={showAddDialog} title="Add New Product">
	{#snippet children()}
		<ProductForm 
			product={null}
			onCancel={() => showAddDialog = false}
			isEditing={false}
			onSuccess={handleFormSuccess}
			onError={handleFormError}
		/>
	{/snippet}
</Dialog>

<Dialog bind:open={showEditDialog} title="Edit Product">
	{#snippet children()}
		<ProductForm 
			product={selectedProduct}
			onCancel={() => showEditDialog = false}
			isEditing={true}
			onSuccess={handleFormSuccess}
			onError={handleFormError}
		/>
	{/snippet}
</Dialog>

<ConfirmDialog 
	bind:open={showDeleteDialog}
	title="Delete Product"
	message="Are you sure you want to delete this product?"
	itemName={selectedProduct?.name}
	itemId={selectedProduct?.id}
	action="?/delete"
	confirmLabel="Delete Product"
	onCancel={() => showDeleteDialog = false}
	onSuccess={handleFormSuccess}
	onError={handleFormError}
/>
