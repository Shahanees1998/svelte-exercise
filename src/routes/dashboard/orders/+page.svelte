<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { Order } from '$lib/types';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ActionButtons from '$lib/components/ui/ActionButtons.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { orderColumns } from '$lib/utils/tableConfigs';
	import { formatPrice } from '$lib/utils/formatters';
	
	let { data }: { data: PageData } = $props();
	
	let showDetailsDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedOrder = $state<Order | null>(null);
	
	function handleFormSuccess(message?: string) {
		showDeleteDialog = false;
		selectedOrder = null;
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
		goto('/dashboard/orders', { keepFocus: true, noScroll: true });
	}
	
	function openDetailsDialog(order: Order) {
		selectedOrder = order;
		showDetailsDialog = true;
	}
	
	function openDeleteDialog(order: Order) {
		selectedOrder = order;
		showDeleteDialog = true;
	}
</script>

<svelte:head>
	<title>Orders - Dashboard</title>
</svelte:head>

<PageHeader 
	title="Orders" 
	description="Manage customer orders"
/>

<SearchBar 
	searchValue={data.search}
	placeholder="Search orders..."
	onSearch={handleSearch}
	onClear={clearSearch}
/>

<DataTable 
	columns={orderColumns}
	data={data.orders}
	keyField="id"
	emptyMessage="No orders found"
	emptyIcon="🛒"
	emptyDescription={data.search ? 'Try a different search term' : 'No orders yet'}
>
	{#snippet rowSnippet(order)}
		<tr>
			<td><strong>{order.orderNumber}</strong></td>
			<td>
				<div>{order.customerName}</div>
				<div style="font-size: 0.85em; color: var(--color-text-secondary);">{order.customerEmail}</div>
			</td>
			<td>{order.items.length} item(s)</td>
			<td><strong>{formatPrice(order.totalAmount)}</strong></td>
			<td><StatusBadge status={order.status} type="status" /></td>
			<td><StatusBadge status={order.paymentStatus} type="payment" /></td>
			<td>{order.createdAt}</td>
			<td>
				<ActionButtons 
					actions={[
						{
							label: "View",
							icon: "👁️",
							variant: "info",
							onclick: () => openDetailsDialog(order),
							'aria-label': `View order ${order.orderNumber}`
						},
						{
							label: "Delete",
							icon: "🗑️",
							variant: "danger",
							onclick: () => openDeleteDialog(order),
							'aria-label': `Delete order ${order.orderNumber}`
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
		itemName="orders"
	/>
{/if}

<Dialog bind:open={showDetailsDialog} title="Order Details">
	{#snippet children()}
		{#if selectedOrder}
			<div class="order-details">
				<div class="detail-section">
					<h3>Order Information</h3>
					<div class="detail-grid">
						<div>
							<strong>Order Number:</strong>
							<div>{selectedOrder.orderNumber}</div>
						</div>
						<div>
							<strong>Date:</strong>
							<div>{selectedOrder.createdAt}</div>
						</div>
						<div>
							<strong>Status:</strong>
							<div><StatusBadge status={selectedOrder.status} type="status" /></div>
						</div>
						<div>
							<strong>Payment:</strong>
							<div><StatusBadge status={selectedOrder.paymentStatus} type="payment" /></div>
						</div>
					</div>
				</div>
				
				<div class="detail-section">
					<h3>Customer Information</h3>
					<div class="detail-grid">
						<div>
							<strong>Name:</strong>
							<div>{selectedOrder.customerName}</div>
						</div>
						<div>
							<strong>Email:</strong>
							<div>{selectedOrder.customerEmail}</div>
						</div>
						<div style="grid-column: 1 / -1;">
							<strong>Shipping Address:</strong>
							<div>{selectedOrder.shippingAddress}</div>
						</div>
					</div>
				</div>
				
				<div class="detail-section">
					<h3>Order Items</h3>
					<div class="items-list">
						{#each selectedOrder.items as item}
							<div class="item-row">
								<div style="flex: 1;">
									<strong>{item.productName}</strong>
									<div style="font-size: 0.85em; color: var(--color-text-secondary);">
										Qty: {item.quantity} × {formatPrice(item.price)}
									</div>
								</div>
								<div style="font-weight: 600;">
									{formatPrice(item.quantity * item.price)}
								</div>
							</div>
						{/each}
						
						<div class="total-row">
							<strong>Total:</strong>
							<strong>{formatPrice(selectedOrder.totalAmount)}</strong>
						</div>
					</div>
				</div>
			</div>
			
			<div class="dialog-footer">
				<button class="btn btn-secondary" onclick={() => showDetailsDialog = false}>
					Close
				</button>
			</div>
		{/if}
	{/snippet}
</Dialog>

<ConfirmDialog 
	bind:open={showDeleteDialog}
	title="Delete Order"
	message="Are you sure you want to delete this order?"
	itemName={selectedOrder?.orderNumber}
	itemId={selectedOrder?.id}
	action="?/delete"
	confirmLabel="Delete Order"
	onCancel={() => showDeleteDialog = false}
	onSuccess={handleFormSuccess}
	onError={handleFormError}
/>
