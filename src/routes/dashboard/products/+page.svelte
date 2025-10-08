<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { productsStore, type Product } from '$lib/stores/data';
	import { formatPrice } from '$lib/utils/validation';
	import { createSearchHandler } from '$lib/utils/debounce';
	import { validateProductForm } from '$lib/utils/formValidators';
	import { 
		PRODUCT_COLUMNS, 
		TABLE_ACTIONS, 
		EMPTY_MESSAGES, 
		SEARCH_PLACEHOLDERS,
		PAGE_HEADERS,
		MODAL_TITLES,
		BUTTON_LABELS,
		SUCCESS_MESSAGES
	} from '$lib/config/tableConfigs';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SearchFilter from '$lib/components/ui/SearchFilter.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';
	import ProductFormModal from '$lib/components/products/ProductFormModal.svelte';

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
	const productColumns = [...PRODUCT_COLUMNS];

	const tableActions = [
		{ 
			...TABLE_ACTIONS.edit, 
			onClick: (row: any) => {
				const product = products.find(p => p.id === row.id);
				if (product) openEditModal(product);
			}
		},
		{ 
			...TABLE_ACTIONS.delete, 
			onClick: (row: any) => {
				const product = products.find(p => p.id === row.id);
				if (product) openDeleteModal(product);
			}
		}
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
		const validation = validateProductForm({
			name: formData.name,
			description: formData.description,
			price: formData.price,
			stock: formData.stock,
			category: formData.category
		});

		if (!validation.valid) {
			toast.error(validation.error);
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
		toast.success(SUCCESS_MESSAGES.product.created);
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
		toast.success(SUCCESS_MESSAGES.product.updated);
	}

	function handleDeleteProduct() {
		if (!selectedProduct) return;

		productsStore.remove(selectedProduct.id);
		closeModals();
		toast.success(SUCCESS_MESSAGES.product.deleted);
	}

</script>

<svelte:head>
	<title>Products - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title={PAGE_HEADERS.products.title}
	subtitle={PAGE_HEADERS.products.subtitle}
	buttonText={PAGE_HEADERS.products.buttonText}
	buttonIcon={PAGE_HEADERS.products.buttonIcon}
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder={SEARCH_PLACEHOLDERS.products}
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={productColumns}
	data={mapProductsToRows(filteredProducts)}
	actions={tableActions}
	{isLoading}
	loadingMessage={EMPTY_MESSAGES.products.loading}
	emptyMessage={searchTerm ? EMPTY_MESSAGES.products.noResults : EMPTY_MESSAGES.products.noData}
	emptyIcon={EMPTY_MESSAGES.products.icon}
/>

<!-- Add Product Modal -->
{#if showAddModal}
<ProductFormModal
	bind:isOpen={showAddModal}
	title={MODAL_TITLES.product.add}
	submitText={BUTTON_LABELS.product.create}
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
	title={MODAL_TITLES.product.edit}
	submitText={BUTTON_LABELS.product.update}
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
	title={MODAL_TITLES.product.delete}
	itemName={selectedProduct?.name || ''}
	itemType="product"
	on:close={closeModals}
	on:confirm={handleDeleteProduct}
/>