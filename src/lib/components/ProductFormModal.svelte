<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormModal from './FormModal.svelte';

	export let isOpen: boolean = false;
	export let title: string;
	export let submitText: string;
	export let name: string = '';
	export let description: string = '';
	export let price: number = 1;
	export let category: string = 'electronics';
	export let stock: number = 1;
	export let status: 'active' | 'inactive' = 'active';
	export let idPrefix: string = 'product';

	const categories = ['electronics', 'clothing', 'home', 'books', 'sports'];
	const statuses = ['active', 'inactive'];

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit() {
		dispatch('submit', {
			name,
			description,
			price,
			category,
			stock,
			status
		});
	}
</script>

<FormModal
	bind:isOpen
	{title}
	size="md"
	{submitText}
	useCustomContent={true}
	on:close={handleClose}
	on:submit={handleSubmit}
>
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<!-- Product Information Section -->
		<div class="form-section">
			<h3>Product Information</h3>
			<div class="form-group">
				<label for="{idPrefix}-name">Product Name <span class="required">*</span></label>
				<input
					id="{idPrefix}-name"
					type="text"
					class="form-input"
					bind:value={name}
					placeholder="Enter product name"
					required
				/>
			</div>
			<div class="form-group">
				<label for="{idPrefix}-description">Description <span class="required">*</span></label>
				<textarea
					id="{idPrefix}-description"
					class="form-textarea"
					bind:value={description}
					placeholder="Enter product description"
					rows="3"
					required
				></textarea>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="{idPrefix}-price">Price ($) <span class="required">*</span></label>
					<input
						id="{idPrefix}-price"
						type="number"
						class="form-input"
						bind:value={price}
						min="0.01"
						step="0.01"
						required
					/>
				</div>
				<div class="form-group">
					<label for="{idPrefix}-stock">Stock <span class="required">*</span></label>
					<input
						id="{idPrefix}-stock"
						type="number"
						class="form-input"
						bind:value={stock}
						min="1"
						required
					/>
				</div>
			</div>
			<div class="form-row" style="margin-top: 1rem;">
				<div class="form-group">
					<label for="{idPrefix}-category">Category</label>
					<select id="{idPrefix}-category" class="form-select" bind:value={category}>
						{#each categories as cat}
							<option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="{idPrefix}-status">Status</label>
					<select id="{idPrefix}-status" class="form-select" bind:value={status}>
						{#each statuses as stat}
							<option value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
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

