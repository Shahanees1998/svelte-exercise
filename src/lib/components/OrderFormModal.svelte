<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormModal from './FormModal.svelte';
	import OrderItemsManager from './OrderItemsManager.svelte';
	import type { OrderItem } from '$lib/stores/data';

	export let isOpen: boolean = false;
	export let title: string;
	export let submitText: string;
	export let customerName: string = '';
	export let customerEmail: string = '';
	export let shippingAddress: string = '';
	export let items: OrderItem[] = [];
	export let status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' = 'pending';
	export let paymentStatus: 'unpaid' | 'paid' | 'refunded' = 'unpaid';
	export let idPrefix: string = 'order'; // 'add' or 'edit'

	const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
	const paymentStatuses = ['unpaid', 'paid', 'refunded'];

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit() {
		dispatch('submit', {
			customerName,
			customerEmail,
			shippingAddress,
			items,
			status,
			paymentStatus
		});
	}

	function handleItemsUpdate(event: CustomEvent) {
		items = event.detail.items;
	}
</script>

<FormModal
	bind:isOpen
	{title}
	size="lg"
	{submitText}
	useCustomContent={true}
	on:close={handleClose}
	on:submit={handleSubmit}
>
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<!-- Customer Information Section -->
		<div class="form-section">
			<h3>Customer Information</h3>
			<div class="form-row">
				<div class="form-group">
					<label for="{idPrefix}-customer-name">Customer Name</label>
					<input
						id="{idPrefix}-customer-name"
						type="text"
						class="form-input"
						bind:value={customerName}
						required
					/>
				</div>
				<div class="form-group">
					<label for="{idPrefix}-customer-email">Customer Email</label>
					<input
						id="{idPrefix}-customer-email"
						type="email"
						class="form-input"
						bind:value={customerEmail}
						required
					/>
				</div>
			</div>
			<div class="form-group" style="margin-top: 1rem;">
				<label for="{idPrefix}-shipping-address">Shipping Address</label>
				<textarea
					id="{idPrefix}-shipping-address"
					class="form-textarea"
					bind:value={shippingAddress}
					rows="2"
					required
				></textarea>
			</div>
		</div>

		<!-- Order Items Section -->
		<OrderItemsManager bind:items {idPrefix} on:update={handleItemsUpdate} />

		<!-- Order Details Section -->
		<div class="form-section">
			<h3>Order Details</h3>
			<div class="form-row">
				<div class="form-group">
					<label for="{idPrefix}-status">Order Status</label>
					<select id="{idPrefix}-status" class="form-select" bind:value={status}>
						{#each orderStatuses as orderStatus}
							<option value={orderStatus}>{orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="{idPrefix}-payment-status">Payment Status</label>
					<select id="{idPrefix}-payment-status" class="form-select" bind:value={paymentStatus}>
						{#each paymentStatuses as payStatus}
							<option value={payStatus}>{payStatus.charAt(0).toUpperCase() + payStatus.slice(1)}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<div class="modal-actions">
			<button type="button" class="btn btn-secondary" on:click={handleClose}>
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				{submitText}
			</button>
		</div>
	</form>
</FormModal>

