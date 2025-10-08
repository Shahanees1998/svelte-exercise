<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { OrderItem, Product } from '$lib/stores/data';
	import { validateRequired, validatePositiveNumber, formatPrice } from '$lib/utils/validation';
	import { toast } from '$lib/stores/toast';
	import ProductSearchDropdown from '../products/ProductSearchDropdown.svelte';

	export let items: OrderItem[] = [];
	export let idPrefix: string = 'item'; // 'add' or 'edit'

	const dispatch = createEventDispatcher();

	let selectedProduct: Product | null = null;
	let itemForm = {
		productName: '',
		quantity: 1,
		price: 0
	};

	function handleProductSelect(event: CustomEvent) {
		const product = event.detail.product;
		selectedProduct = product;
		itemForm.productName = product.name;
		itemForm.price = product.price;
	}

	function handleProductClear() {
		selectedProduct = null;
		itemForm.productName = '';
		itemForm.price = 0;
	}

	function addItem() {
		const nameValidation = validateRequired(itemForm.productName, 'Product name');
		if (!nameValidation.valid) {
			toast.error(nameValidation.error);
			return;
		}

		const quantityValidation = validatePositiveNumber(itemForm.quantity, 'Quantity');
		if (!quantityValidation.valid) {
			toast.error(quantityValidation.error);
			return;
		}

		const priceValidation = validatePositiveNumber(itemForm.price, 'Price');
		if (!priceValidation.valid) {
			toast.error(priceValidation.error);
			return;
		}

		const newItem: OrderItem = {
			productId: selectedProduct?.id || Date.now(),
			productName: itemForm.productName,
			quantity: itemForm.quantity,
			price: itemForm.price
		};

		items = [...items, newItem];
		dispatch('update', { items });
		selectedProduct = null;
		itemForm = { productName: '', quantity: 1, price: 0 };
		toast.success('Item added to order');
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
		dispatch('update', { items });
	}

	function calculateTotal(itemsList: OrderItem[]): number {
		return itemsList.reduce((sum, item) => sum + (item.quantity * item.price), 0);
	}
</script>

<div class="form-section">
	<h3>Order Items</h3>
	<div class="items-container">
		{#if items.length > 0}
			<div class="items-list">
				{#each items as item, index}
					<div class="item-row">
						<div class="item-details">
							<strong>{item.productName}</strong>
							<span>Qty: {item.quantity} × {formatPrice(item.price)}</span>
							<span class="item-total">{formatPrice(item.quantity * item.price)}</span>
						</div>
						<button
							type="button"
							class="btn-remove"
							on:click={() => removeItem(index)}
						>×</button>
					</div>
				{/each}
			</div>
			<div class="order-total-display">
				<strong>Total: {formatPrice(calculateTotal(items))}</strong>
			</div>
		{:else}
			<p class="no-items">No items added yet</p>
		{/if}
	</div>

	<div class="add-item-form">
		<h4>Add Item</h4>
		<div class="item-form-row">
			<div class="form-group">
				<label for="{idPrefix}-product-search">Product</label>
				<ProductSearchDropdown
					bind:selectedProduct
					idPrefix="{idPrefix}-product"
					on:select={handleProductSelect}
					on:clear={handleProductClear}
				/>
			</div>
			<div class="form-group">
				<label for="{idPrefix}-quantity">Quantity</label>
				<input
					id="{idPrefix}-quantity"
					type="number"
					class="form-input"
					bind:value={itemForm.quantity}
					min="1"
					on:invalid|preventDefault
				/>
			</div>
			<div class="form-group">
				<label for="{idPrefix}-price">Price ($)</label>
				<input
					id="{idPrefix}-price"
					type="number"
					class="form-input"
					bind:value={itemForm.price}
					min="0.01"
					step="0.01"
					on:invalid|preventDefault
				/>
			</div>
			<div class="form-group">
				<div style="height: 28px;"></div>
				<button type="button" class="btn btn-secondary" on:click={addItem}>
					Add Item
				</button>
			</div>
		</div>
	</div>
</div>

