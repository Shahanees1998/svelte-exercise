<script lang="ts">
	import { enhance } from '$app/forms';
	import { ProductCategory, ProductStatus, type Product } from '$lib/types';

	interface Props {
		product?: Product | null;
		onCancel: () => void;
		isEditing?: boolean;
		onSuccess?: (message?: string) => void;
		onError?: (error: string) => void;
	}

	let { product, onCancel, isEditing = false, onSuccess, onError }: Props = $props();
	let isSubmitting = $state(false);
</script>

<form 
	method="POST" 
	action={isEditing ? "?/update" : "?/create"} 
	use:enhance={() => {
		isSubmitting = true;
		return async ({ result, update }) => {
			await update();
			isSubmitting = false;
			if (result.type === 'success') {
				const message = result.data?.message || (isEditing ? 'Product updated successfully' : 'Product created successfully');
				onSuccess?.(message);
			} else if (result.type === 'failure') {
				const error = result.data?.error || 'An error occurred';
				onError?.(error);
			}
		};
	}}
	class="product-form"
>
	{#if isEditing && product}
		<input type="hidden" name="id" value={product.id} />
	{/if}
	
	<div class="form-group">
		<label for={isEditing ? "edit-name" : "name"}>Product Name *</label>
		<input
			id={isEditing ? "edit-name" : "name"}
			name="name"
			type="text"
			class="form-input"
			value={product?.name || ''}
			required
		/>
	</div>
	
	<div class="form-group">
		<label for={isEditing ? "edit-description" : "description"}>Description *</label>
		<textarea
			id={isEditing ? "edit-description" : "description"}
			name="description"
			class="form-textarea"
			required
			rows="3"
		>{product?.description || ''}</textarea>
	</div>
	
	<div class="form-row">
		<div class="form-group">
			<label for={isEditing ? "edit-price" : "price"}>Price ($) *</label>
			<input
				id={isEditing ? "edit-price" : "price"}
				name="price"
				type="number"
				class="form-input"
				value={product?.price || 0}
				min="0"
				step="0.01"
				required
			/>
		</div>
		
		<div class="form-group">
			<label for={isEditing ? "edit-stock" : "stock"}>Stock *</label>
			<input
				id={isEditing ? "edit-stock" : "stock"}
				name="stock"
				type="number"
				class="form-input"
				value={product?.stock || 0}
				min="0"
				required
			/>
		</div>
	</div>
	
	<div class="form-row">
		<div class="form-group">
			<label for={isEditing ? "edit-category" : "category"}>Category *</label>
			<select
				id={isEditing ? "edit-category" : "category"}
				name="category"
				class="form-select"
				value={product?.category || ProductCategory.ELECTRONICS}
				required
			>
				<option value={ProductCategory.ELECTRONICS}>Electronics</option>
				<option value={ProductCategory.CLOTHING}>Clothing</option>
				<option value={ProductCategory.HOME}>Home</option>
				<option value={ProductCategory.BOOKS}>Books</option>
				<option value={ProductCategory.SPORTS}>Sports</option>
			</select>
		</div>
		
		<div class="form-group">
			<label for={isEditing ? "edit-status" : "status"}>Status *</label>
			<select
				id={isEditing ? "edit-status" : "status"}
				name="status"
				class="form-select"
				value={product?.status || ProductStatus.ACTIVE}
				required
			>
				<option value={ProductStatus.ACTIVE}>Active</option>
				<option value={ProductStatus.INACTIVE}>Inactive</option>
			</select>
		</div>
	</div>
	
	<div class="form-actions">
		<button type="button" class="btn btn-secondary" onclick={onCancel}>
			Cancel
		</button>
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
		</button>
	</div>
</form>

<!-- All styles moved to app.css -->
