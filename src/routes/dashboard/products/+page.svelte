<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { productsStore, type Product } from '$lib/stores/data';
	import { validateRequired, validatePositiveNumber, formatPrice } from '$lib/utils/validation';
	import { createSearchHandler } from '$lib/utils/debounce';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchFilter from '$lib/components/SearchFilter.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import ProductFormModal from '$lib/components/ProductFormModal.svelte';

	let products: Product[] = [];
	let filteredProducts: Product[] = [];
	let searchTerm = '';
	let showAddModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let selectedProduct: Product | null = null;
	let isLoading = false;
	let isSearching = false;

	// Form data for add/edit
	let formData = {
		name: '',
		description: '',
		price: 1,
		category: 'electronics',
		stock: 1,
		status: 'active' as 'active' | 'inactive'
	};

	// DataTable columns and actions
	const productColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'description', label: 'Description' },
		{ key: 'price', label: 'Price' },
		{ key: 'category', label: 'Category' },
		{ key: 'stock', label: 'Stock' },
		{ key: 'status', label: 'Status' },
		{ key: 'createdAt', label: 'Created' }
	];

	const tableActions = [
		{ label: 'Edit', class: 'btn-secondary', onClick: (row: any) => {
			const product = products.find(p => p.id === row.id);
			if (product) openEditModal(product);
		}},
		{ label: 'Delete', class: 'btn-danger', onClick: (row: any) => {
			const product = products.find(p => p.id === row.id);
			if (product) openDeleteModal(product);
		}}
	];

	function mapProductsToRows(list: Product[]) {
		return list.map((product) => ({
			id: product.id,
			name: product.name,
			description: product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description,
			price: formatPrice(product.price),
			category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
			stock: product.stock.toString(),
			status: `<span class="status-badge status-${product.status}">${product.status}</span>`,
			createdAt: product.createdAt
		}));
	}

	// Subscribe to store
	const unsubscribe = productsStore.subscribe(value => {
		products = value;
		filterProducts();
	});

	onMount(() => {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 300);

		return () => {
			unsubscribe();
		};
	});

	function filterProducts() {
		let filtered = [...products];

		if (searchTerm.trim()) {
			filtered = filtered.filter(product =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		filteredProducts = filtered;
		isSearching = false;
	}

	// Debounced handlers
	const debouncedSearch = createSearchHandler(() => {
		filterProducts();
	}, 500);

	function handleSearch() {
		isSearching = true;
		debouncedSearch();
	}

	function openAddModal() {
		formData = { name: '', description: '', price: 1, category: 'electronics', stock: 1, status: 'active' };
		showAddModal = true;
	}

	function openEditModal(product: Product) {
		selectedProduct = product;
		formData = { name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, status: product.status };
		showEditModal = true;
	}

	function openDeleteModal(product: Product) {
		selectedProduct = product;
		showDeleteModal = true;
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		showDeleteModal = false;
		selectedProduct = null;
	}

	function validateForm(): boolean {
		const nameValidation = validateRequired(formData.name, 'Product name');
		if (!nameValidation.valid) {
			toast.error(nameValidation.error);
			return false;
		}

		const descriptionValidation = validateRequired(formData.description, 'Product description');
		if (!descriptionValidation.valid) {
			toast.error(descriptionValidation.error);
			return false;
		}

		const priceValidation = validatePositiveNumber(formData.price, 'Price');
		if (!priceValidation.valid) {
			toast.error(priceValidation.error);
			return false;
		}

		const stockValidation = validatePositiveNumber(formData.stock, 'Stock');
		if (!stockValidation.valid) {
			toast.error(stockValidation.error);
			return false;
		}

		return true;
	}

	function handleAddProduct() {
		if (!validateForm()) return;

		const productData = {
			name: formData.name,
			description: formData.description,
			price: formData.price,
			category: formData.category,
			stock: formData.stock,
			status: formData.status
		};

		productsStore.add(productData);
		closeModals();
		toast.success('Product created successfully!');
	}

	function handleEditProduct() {
		if (!validateForm() || !selectedProduct) return;

		const updates = {
			name: formData.name,
			description: formData.description,
			price: formData.price,
			category: formData.category,
			stock: formData.stock,
			status: formData.status
		};

		productsStore.update(selectedProduct.id, updates);
		closeModals();
		toast.success('Product updated successfully!');
	}

	function handleDeleteProduct() {
		if (!selectedProduct) return;

		productsStore.remove(selectedProduct.id);
		closeModals();
		toast.success('Product deleted successfully!');
	}

</script>

<svelte:head>
	<title>Products - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title="Products"
	subtitle="Manage product catalog and inventory"
	buttonText="Add Product"
	buttonIcon="+"
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder="Search products by name or description..."
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={productColumns}
	data={mapProductsToRows(filteredProducts)}
	actions={tableActions}
	{isLoading}
	loadingMessage="Loading products..."
	emptyMessage={searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first product'}
	emptyIcon="📦"
/>

<!-- Add Product Modal -->
{#if showAddModal}
<ProductFormModal
	bind:isOpen={showAddModal}
	title="Create New Product"
	submitText="Create Product"
	bind:name={formData.name}
	bind:description={formData.description}
	bind:price={formData.price}
	bind:category={formData.category}
	bind:stock={formData.stock}
	bind:status={formData.status}
	idPrefix="add"
	on:close={closeModals}
	on:submit={handleAddProduct}
/>
{/if}

<!-- Edit Product Modal -->
{#if showEditModal && selectedProduct}
{#key selectedProduct.id}
<ProductFormModal
	bind:isOpen={showEditModal}
	title="Edit Product"
	submitText="Update Product"
	bind:name={formData.name}
	bind:description={formData.description}
	bind:price={formData.price}
	bind:category={formData.category}
	bind:stock={formData.stock}
	bind:status={formData.status}
	idPrefix="edit"
	on:close={closeModals}
	on:submit={handleEditProduct}
/>
{/key}
{/if}

<!-- Delete Product Modal -->
<DeleteModal
	bind:isOpen={showDeleteModal}
	title="Delete Product"
	itemName={selectedProduct?.name || ''}
	itemType="product"
	on:close={closeModals}
	on:confirm={handleDeleteProduct}
/>