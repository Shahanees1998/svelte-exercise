<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Order } from '$lib/stores/data';
	import { formatPrice } from '$lib/utils/validation';

	export let isOpen: boolean = false;
	export let order: Order | null = null;

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleEdit() {
		dispatch('edit', { order });
	}

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

{#if isOpen && order}
	<div class="modal-overlay" on:click={handleClose} on:keydown={handleClose} role="button" tabindex="0">
		<div class="modal modal-lg" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>Order Details - {order.orderNumber}</h2>
				<button class="modal-close" on:click={handleClose}>×</button>
			</div>
			<div class="modal-body">
				<div class="details-section">
					<h3>Customer Information</h3>
					<div class="details-grid">
						<div class="detail-item">
							<span class="detail-label">Name:</span>
							<span class="detail-value">{order.customerName}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Email:</span>
							<span class="detail-value">{order.customerEmail}</span>
						</div>
						<div class="detail-item full-width">
							<span class="detail-label">Shipping Address:</span>
							<span class="detail-value">{order.shippingAddress}</span>
						</div>
					</div>
				</div>

				<div class="details-section">
					<h3>Order Items</h3>
					<div class="details-items-list">
						{#each order.items as item}
							<div class="details-item-row">
								<span class="item-name">{item.productName}</span>
								<span class="item-quantity">Qty: {item.quantity}</span>
								<span class="item-price">{formatPrice(item.price)}</span>
								<span class="item-subtotal">{formatPrice(item.quantity * item.price)}</span>
							</div>
						{/each}
						<div class="details-total">
							<span>Total Amount:</span>
							<span class="total-amount">{formatPrice(order.totalAmount)}</span>
						</div>
					</div>
				</div>

				<div class="details-section">
					<h3>Order Status</h3>
					<div class="details-grid">
						<div class="detail-item">
							<span class="detail-label">Order Status:</span>
							<span class="status-badge {getStatusClass(order.status)}">
								{order.status}
							</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Payment Status:</span>
							<span class="payment-badge {getPaymentStatusClass(order.paymentStatus)}">
								{order.paymentStatus}
							</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Order Date:</span>
							<span class="detail-value">{order.createdAt}</span>
						</div>
					</div>
				</div>

				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" on:click={handleClose}>
						Close
					</button>
					<button type="button" class="btn btn-primary" on:click={handleEdit}>
						Edit Order
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

