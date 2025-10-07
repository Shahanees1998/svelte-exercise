<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { ordersStore, type Order, type OrderItem } from '$lib/stores/data';
	import { validateEmail, validateRequired, validatePositiveNumber, formatPrice } from '$lib/utils/validation';
	import { createSearchHandler } from '$lib/utils/debounce';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchFilter from '$lib/components/SearchFilter.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import OrderDetailsModal from '$lib/components/OrderDetailsModal.svelte';
	import OrderFormModal from '$lib/components/OrderFormModal.svelte';

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
	const orderColumns = [
		{ key: 'orderNumber', label: 'Order #' },
		{ key: 'customerName', label: 'Customer' },
		{ key: 'customerEmail', label: 'Email' },
		{ key: 'totalAmount', label: 'Total' },
		{ key: 'status', label: 'Status' },
		{ key: 'paymentStatus', label: 'Payment' },
		{ key: 'createdAt', label: 'Date' }
	];

	const tableActions = [
		{ label: 'View', class: 'btn-info', onClick: (row: any) => {
			const order = orders.find(o => o.id === row.id);
			if (order) openDetailsModal(order);
		}},
		{ label: 'Edit', class: 'btn-secondary', onClick: (row: any) => {
			const order = orders.find(o => o.id === row.id);
			if (order) openEditModal(order);
		}},
		{ label: 'Delete', class: 'btn-danger', onClick: (row: any) => {
			const order = orders.find(o => o.id === row.id);
			if (order) openDeleteModal(order);
		}}
	];

	function mapOrdersToRows(list: Order[]) {
		return list.map((order) => ({
			id: order.id,
			orderNumber: order.orderNumber,
			customerName: order.customerName,
			customerEmail: order.customerEmail,
			totalAmount: formatPrice(order.totalAmount),
			status: `<span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>`,
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
		let filtered = [...orders];

		if (searchTerm.trim()) {
			filtered = filtered.filter(order =>
				order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		filteredOrders = filtered;
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

	function calculateTotal(items: OrderItem[]): number {
		return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
	}

	function validateForm(): boolean {
		const nameValidation = validateRequired(formData.customerName, 'Customer name');
		if (!nameValidation.valid) {
			toast.error(nameValidation.error);
			return false;
		}

		const emailValidation = validateRequired(formData.customerEmail, 'Customer email');
		if (!emailValidation.valid) {
			toast.error(emailValidation.error);
			return false;
		}

		if (!validateEmail(formData.customerEmail)) {
			toast.error('Please enter a valid email address');
			return false;
		}

		if (formData.items.length === 0) {
			toast.error('Please add at least one item to the order');
			return false;
		}

		const addressValidation = validateRequired(formData.shippingAddress, 'Shipping address');
		if (!addressValidation.valid) {
			toast.error(addressValidation.error);
			return false;
		}

		return true;
	}

	function generateOrderNumber(): string {
		const year = new Date().getFullYear();
		const randomNum = Math.floor(Math.random() * 10000).toString().padStart(3, '0');
		return `ORD-${year}-${randomNum}`;
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
			totalAmount: calculateTotal(formData.items),
			status: formData.status,
			paymentStatus: formData.paymentStatus,
			shippingAddress: formData.shippingAddress
		};

		ordersStore.add(orderData);
		closeModals();
		toast.success('Order created successfully!');
	}

	function handleEditOrder(event: CustomEvent) {
		const data = event.detail;
		formData = { ...formData, ...data };

		if (!validateForm() || !selectedOrder) return;

		const updates = {
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			items: formData.items,
			totalAmount: calculateTotal(formData.items),
			status: formData.status,
			paymentStatus: formData.paymentStatus,
			shippingAddress: formData.shippingAddress
		};

		ordersStore.update(selectedOrder.id, updates);
		closeModals();
		toast.success('Order updated successfully!');
	}

	function handleDeleteOrder() {
		if (!selectedOrder) return;

		ordersStore.remove(selectedOrder.id);
		closeModals();
		toast.success('Order deleted successfully!');
	}

	// Helper functions for table display
	function getStatusClass(status: string) {
		switch (status) {
			case 'pending': return 'status-pending';
			case 'processing': return 'status-processing';
			case 'shipped': return 'status-shipped';
			case 'delivered': return 'status-delivered';
			case 'cancelled': return 'status-cancelled';
			default: return '';
		}
	}

	function getPaymentStatusClass(status: string) {
		switch (status) {
			case 'unpaid': return 'payment-unpaid';
			case 'paid': return 'payment-paid';
			case 'refunded': return 'payment-refunded';
			default: return '';
		}
	}

</script>

<svelte:head>
	<title>Orders - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title="Orders"
	subtitle="Manage customer orders and track deliveries"
	buttonText="Add Order"
	buttonIcon="+"
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder="Search orders by number, customer name or email..."
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={orderColumns}
	data={mapOrdersToRows(filteredOrders)}
	actions={tableActions}
	{isLoading}
	loadingMessage="Loading orders..."
	emptyMessage={searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first order'}
	emptyIcon="📋"
/>

<!-- Add Order Modal -->
{#if showAddModal}
<OrderFormModal
	bind:isOpen={showAddModal}
	title="Create New Order"
	submitText="Create Order"
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
	title="Edit Order"
	submitText="Update Order"
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
	title="Delete Order"
	itemName={selectedOrder?.orderNumber || ''}
	itemType="order"
	on:close={closeModals}
	on:confirm={handleDeleteOrder}
/>

