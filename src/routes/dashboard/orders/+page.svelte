<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Order } from '$lib/server/data';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	
	let { data }: { data: PageData } = $props();
	
	let showDetailsDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedOrder = $state<Order | null>(null);
	
	function handleSearch(e: Event) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;
		const status = formData.get('status') as string;
		
		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
		}
		
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function clearFilters() {
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
	
	function handleDeleteOrder() {
		if (!selectedOrder) return;
		
		// In a real app, this would call an API endpoint
		showDeleteDialog = false;
		toast.success('Order deleted successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function formatPrice(price: number) {
		return `$${price.toFixed(2)}`;
	}
	
	function getStatusColor(status: string) {
		const colors: Record<string, string> = {
			pending: 'status-pending',
			processing: 'status-processing',
			shipped: 'status-shipped',
			delivered: 'status-delivered',
			cancelled: 'status-cancelled'
		};
		return colors[status] || '';
	}
</script>

<svelte:head>
	<title>Orders - Dashboard</title>
</svelte:head>

<div class="page-header">
	<div>
		<h1>Orders</h1>
		<p>Manage customer orders</p>
	</div>
</div>

<!-- Search & Filter Form -->
<form class="search-section" onsubmit={handleSearch}>
	<div class="filter-container">
		<input
			type="search"
			name="search"
			class="form-input"
			placeholder="Search orders..."
			value={data.search}
			style="flex: 1; max-width: 400px;"
		/>
		
		<select name="status" class="form-select" value={data.statusFilter}>
			<option value="">All Status</option>
			<option value="pending">Pending</option>
			<option value="processing">Processing</option>
			<option value="shipped">Shipped</option>
			<option value="delivered">Delivered</option>
			<option value="cancelled">Cancelled</option>
		</select>
		
		<button type="submit" class="btn btn-primary btn-sm">
			🔍 Filter
		</button>
		
		{#if data.search || data.statusFilter}
			<button type="button" class="btn btn-secondary btn-sm" onclick={clearFilters}>
				Clear
			</button>
		{/if}
	</div>
</form>

<!-- Orders Table -->
<div class="card">
	{#if data.orders.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🛒</div>
			<h3>No orders found</h3>
			<p>{data.search || data.statusFilter ? 'Try adjusting your filters' : 'No orders yet'}</p>
		</div>
	{:else}
		<div class="table-container">
			<table class="data-table">
				<thead>
					<tr>
						<th>Order #</th>
						<th>Customer</th>
						<th>Items</th>
						<th>Total</th>
						<th>Status</th>
						<th>Payment</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.orders as order (order.id)}
						<tr>
							<td><strong>{order.orderNumber}</strong></td>
							<td>
								<div>{order.customerName}</div>
								<div style="font-size: 0.85em; color: var(--color-text-secondary);">{order.customerEmail}</div>
							</td>
							<td>{order.items.length} item(s)</td>
							<td><strong>{formatPrice(order.totalAmount)}</strong></td>
							<td><span class="badge {getStatusColor(order.status)}">{order.status}</span></td>
							<td><span class="badge">{order.paymentStatus}</span></td>
							<td>{order.createdAt}</td>
							<td>
								<div class="flex gap-sm">
									<button 
										class="btn btn-sm btn-info" 
										onclick={() => openDetailsDialog(order)}
									>
										👁️ View
									</button>
									<button 
										class="btn btn-sm btn-danger" 
										onclick={() => openDeleteDialog(order)}
									>
										🗑️
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

<!-- Order Details Dialog -->
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
							<div><span class="badge {getStatusColor(selectedOrder.status)}">{selectedOrder.status}</span></div>
						</div>
						<div>
							<strong>Payment:</strong>
							<div><span class="badge">{selectedOrder.paymentStatus}</span></div>
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

<!-- Delete Order Dialog -->
<Dialog bind:open={showDeleteDialog} title="Delete Order">
	{#snippet children()}
		<p>Are you sure you want to delete order <strong>{selectedOrder?.orderNumber}</strong>?</p>
		<p>This action cannot be undone.</p>
		
		<div class="dialog-footer">
			<button class="btn btn-secondary" onclick={() => showDeleteDialog = false}>
				Cancel
			</button>
			<button class="btn btn-danger" onclick={handleDeleteOrder}>
				Delete Order
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
	
	.filter-container {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
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
	
	.order-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}
	
	.detail-section {
		border-bottom: 1px solid var(--color-border-light);
		padding-bottom: var(--space-lg);
	}
	
	.detail-section:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
	
	.detail-section h3 {
		margin-bottom: var(--space-md);
		font-size: var(--font-size-lg);
	}
	
	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
	}
	
	.detail-grid strong {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}
	
	.items-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		background-color: var(--color-bg-tertiary);
		padding: var(--space-md);
		border-radius: var(--radius-md);
	}
	
	.item-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm);
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-sm);
	}
	
	.total-row {
		display: flex;
		justify-content: space-between;
		padding: var(--space-sm);
		border-top: 2px solid var(--color-border-medium);
		margin-top: var(--space-sm);
		font-size: var(--font-size-lg);
	}
	
	@media (max-width: 768px) {
		.filter-container {
			flex-direction: column;
		}
		
		.filter-container input,
		.filter-container select {
			width: 100%;
			max-width: none !important;
		}
		
		.detail-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
