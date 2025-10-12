<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from './Dialog.svelte';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		itemName?: string;
		itemId?: number;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: 'danger' | 'warning' | 'info';
		action?: string;
		onConfirm?: () => void;
		onCancel: () => void;
		onSuccess?: (message?: string) => void;
		onError?: (error: string) => void;
	}

	let { 
		open, 
		title, 
		message, 
		itemName,
		itemId,
		confirmLabel = 'Confirm', 
		cancelLabel = 'Cancel',
		variant = 'danger',
		action,
		onConfirm,
		onCancel,
		onSuccess,
		onError
	}: Props = $props();
	
	let isSubmitting = $state(false);

	function handleConfirm() {
		if (onConfirm) {
			onConfirm();
		}
	}
</script>

<Dialog bind:open title={title}>
	{#snippet children()}
		{#if action && itemId !== undefined}
			<!-- Form-based action -->
			<form method="POST" {action} use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;
					if (result.type === 'success') {
						const message = result.data?.message || 'Item deleted successfully';
						onSuccess?.(message);
					} else if (result.type === 'failure') {
						const error = result.data?.error || 'An error occurred';
						onError?.(error);
					}
				};
			}}>
				<input type="hidden" name="id" value={itemId} />
				
				<div class="confirm-dialog">
					<div class="confirm-icon {variant}" aria-hidden="true">
						{#if variant === 'danger'}
							⚠️
						{:else if variant === 'warning'}
							⚠️
						{:else}
							ℹ️
						{/if}
					</div>
					
					<div class="confirm-content">
						<p>{message}</p>
						{#if itemName}
							<p class="item-name"><strong>{itemName}</strong></p>
						{/if}
						<p class="confirm-warning">This action cannot be undone.</p>
					</div>
					
					<div class="confirm-actions">
						<button type="button" class="btn btn-secondary" onclick={onCancel}>
							{cancelLabel}
						</button>
						<button type="submit" class="btn btn-{variant}" disabled={isSubmitting}>
							{isSubmitting ? 'Deleting...' : confirmLabel}
						</button>
					</div>
				</div>
			</form>
		{:else}
			<!-- Callback-based action -->
			<div class="confirm-dialog">
				<div class="confirm-icon {variant}" aria-hidden="true">
					{#if variant === 'danger'}
						⚠️
					{:else if variant === 'warning'}
						⚠️
					{:else}
						ℹ️
					{/if}
				</div>
				
				<div class="confirm-content">
					<p>{message}</p>
					{#if itemName}
						<p class="item-name"><strong>{itemName}</strong></p>
					{/if}
					<p class="confirm-warning">This action cannot be undone.</p>
				</div>
				
				<div class="confirm-actions">
					<button class="btn btn-secondary" onclick={onCancel}>
						{cancelLabel}
					</button>
					<button class="btn btn-{variant}" onclick={handleConfirm}>
						{confirmLabel}
					</button>
				</div>
			</div>
		{/if}
	{/snippet}
</Dialog>

<!-- All styles moved to app.css -->
