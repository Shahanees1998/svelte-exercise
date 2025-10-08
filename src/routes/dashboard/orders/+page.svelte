<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { ordersStore, type Order, type OrderItem } from '$lib/stores/data';
	import { formatPrice } from '$lib/utils/validation';
	import { createSearchHandler } from '$lib/utils/debounce';
	import { getOrderStatusClass, getPaymentStatusClass } from '$lib/utils/statusHelpers';
	import { generateOrderNumber, calculateOrderTotal, searchOrders } from '$lib/utils/orderHelpers';
	import { validateOrderForm } from '$lib/utils/formValidators';
	import { 
		ORDER_COLUMNS, 
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
	import OrderDetailsModal from '$lib/components/orders/OrderDetailsModal.svelte';
	import OrderFormModal from '$lib/components/orders/OrderFormModal.svelte';

	let orders: Order[] = [];
	let filteredOrders: Order[] = [];
	let searchTerm = '';
	let showAddModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let showDetailsModal = false;
	let selectedOrder: Order | null = null;
	let isLoading = false;
	let isSearching = false;

	// Form data for add/edit
	let formData = {
		customerName: '',
		customerEmail: '',
		items: [] as OrderItem[],
		status: 'pending' as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
		paymentStatus: 'unpaid' as 'unpaid' | 'paid' | 'refunded',
		shippingAddress: ''
	};

	// DataTable columns and actions
	const orderColumns = [...ORDER_COLUMNS];

	const tableActions = [
		{ 
			...TABLE_ACTIONS.view, 
			onClick: (row: any) => {
				const order = orders.find(o => o.id === row.id);
				if (order) openDetailsModal(order);
			}
		},
		{ 
			...TABLE_ACTIONS.edit, 
			onClick: (row: any) => {
				const order = orders.find(o => o.id === row.id);
				if (order) openEditModal(order);
			}
		},
		{ 
			...TABLE_ACTIONS.delete, 
			onClick: (row: any) => {
				const order = orders.find(o => o.id === row.id);
				if (order) openDeleteModal(order);
			}
		}
	];

	function mapOrdersToRows(list: Order[]) {
		return list.map((order) => ({
			id: order.id,
			orderNumber: order.orderNumber,
			customerName: order.customerName,
			customerEmail: order.customerEmail,
			totalAmount: formatPrice(order.totalAmount),
			status: `<span class="status-badge ${getOrderStatusClass(order.status)}">${order.status}</span>`,
			paymentStatus: `<span class=\"payment-badge ${getPaymentStatusClass(order.paymentStatus)}\">${order.paymentStatus}</span>`,
			createdAt: order.createdAt
		}));
	}

	// Subscribe to store
	const unsubscribe = ordersStore.subscribe(value => {
		orders = value;
		filterOrders();
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

	function filterOrders() {
		filteredOrders = searchOrders(orders, searchTerm);
		isSearching = false;
	}

	// Debounced handlers
	const debouncedSearch = createSearchHandler(() => {
		filterOrders();
	}, 500);

	function handleSearch() {
		isSearching = true;
		debouncedSearch();
	}

	function openAddModal() {
		formData = {
			customerName: '',
			customerEmail: '',
			items: [],
			status: 'pending',
			paymentStatus: 'unpaid',
			shippingAddress: ''
		};
		showAddModal = true;
	}

	function openEditModal(order: Order) {
		selectedOrder = order;
		formData = {
			customerName: order.customerName,
			customerEmail: order.customerEmail,
			items: [...order.items],
			status: order.status,
			paymentStatus: order.paymentStatus,
			shippingAddress: order.shippingAddress
		};
		showEditModal = true;
	}

	function openDeleteModal(order: Order) {
		selectedOrder = order;
		showDeleteModal = true;
	}

	function openDetailsModal(order: Order) {
		selectedOrder = order;
		showDetailsModal = true;
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		showDeleteModal = false;
		showDetailsModal = false;
		selectedOrder = null;
	}

	function validateForm(): boolean {
		const validation = validateOrderForm({
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			items: formData.items,
			shippingAddress: formData.shippingAddress
		});

		if (!validation.valid) {
			toast.error(validation.error);
			return false;
		}

		return true;
	}

	function handleAddOrder(event: CustomEvent) {
		const data = event.detail;
		formData = { ...formData, ...data };

		if (!validateForm()) return;

		const orderData = {
			orderNumber: generateOrderNumber(),
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			items: formData.items,
			totalAmount: calculateOrderTotal(formData.items),
			status: formData.status,
			paymentStatus: formData.paymentStatus,
			shippingAddress: formData.shippingAddress
		};

		ordersStore.add(orderData);
		closeModals();
		toast.success(SUCCESS_MESSAGES.order.created);
	}

	function handleEditOrder(event: CustomEvent) {
		const data = event.detail;
		formData = { ...formData, ...data };

		if (!validateForm() || !selectedOrder) return;

		const updates = {
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			items: formData.items,
			totalAmount: calculateOrderTotal(formData.items),
			status: formData.status,
			paymentStatus: formData.paymentStatus,
			shippingAddress: formData.shippingAddress
		};

		ordersStore.update(selectedOrder.id, updates);
		closeModals();
		toast.success(SUCCESS_MESSAGES.order.updated);
	}

	function handleDeleteOrder() {
		if (!selectedOrder) return;

		ordersStore.remove(selectedOrder.id);
		closeModals();
		toast.success(SUCCESS_MESSAGES.order.deleted);
	}
</script>

<svelte:head>
	<title>Orders - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title={PAGE_HEADERS.orders.title}
	subtitle={PAGE_HEADERS.orders.subtitle}
	buttonText={PAGE_HEADERS.orders.buttonText}
	buttonIcon={PAGE_HEADERS.orders.buttonIcon}
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder={SEARCH_PLACEHOLDERS.orders}
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={orderColumns}
	data={mapOrdersToRows(filteredOrders)}
	actions={tableActions}
	{isLoading}
	loadingMessage={EMPTY_MESSAGES.orders.loading}
	emptyMessage={searchTerm ? EMPTY_MESSAGES.orders.noResults : EMPTY_MESSAGES.orders.noData}
	emptyIcon={EMPTY_MESSAGES.orders.icon}
/>

<!-- Add Order Modal -->
{#if showAddModal}
<OrderFormModal
	bind:isOpen={showAddModal}
	title={MODAL_TITLES.order.add}
	submitText={BUTTON_LABELS.order.create}
	bind:customerName={formData.customerName}
	bind:customerEmail={formData.customerEmail}
	bind:shippingAddress={formData.shippingAddress}
	bind:items={formData.items}
	bind:status={formData.status}
	bind:paymentStatus={formData.paymentStatus}
	idPrefix="add"
	on:close={closeModals}
	on:submit={handleAddOrder}
/>
{/if}

<!-- Edit Order Modal -->
{#if showEditModal && selectedOrder}
{#key selectedOrder.id}
<OrderFormModal
	bind:isOpen={showEditModal}
	title={MODAL_TITLES.order.edit}
	submitText={BUTTON_LABELS.order.update}
	bind:customerName={formData.customerName}
	bind:customerEmail={formData.customerEmail}
	bind:shippingAddress={formData.shippingAddress}
	bind:items={formData.items}
	bind:status={formData.status}
	bind:paymentStatus={formData.paymentStatus}
	idPrefix="edit"
	on:close={closeModals}
	on:submit={handleEditOrder}
/>
{/key}
{/if}

<!-- Order Details Modal -->
{#if showDetailsModal && selectedOrder}
{#key selectedOrder.id}
<OrderDetailsModal
	bind:isOpen={showDetailsModal}
	order={selectedOrder}
	on:close={closeModals}
	on:edit={(e) => {
		closeModals();
		if (e.detail.order) openEditModal(e.detail.order);
	}}
/>
{/key}
{/if}

<!-- Delete Order Modal -->
<DeleteModal
	bind:isOpen={showDeleteModal}
	title={MODAL_TITLES.order.delete}
	itemName={selectedOrder?.orderNumber || ''}
	itemType="order"
	on:close={closeModals}
	on:confirm={handleDeleteOrder}
/>

