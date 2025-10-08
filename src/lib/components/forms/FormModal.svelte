<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormField from './FormField.svelte';
	
	export let isOpen = false;
	export let title = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let fields: Array<{
		key: string;
		label: string;
		type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
		value: any;
		placeholder?: string;
		required?: boolean;
		options?: Array<{value: string, label: string}>;
		rows?: number;
		showPasswordToggle?: boolean;
	}> = [];
	export let sections: Array<{
		title: string;
		fields: string[];
	}> = [];
	export let submitText = 'Save';
	export let isLoading = false;
	export let showCloseButton = true;
	export let useCustomContent = false; // Whether to use custom content instead of form fields
	
	const dispatch = createEventDispatcher();
	
	function handleClose() {
		dispatch('close');
	}
	
	function handleSubmit() {
		dispatch('submit', { fields });
	}
	
	function updateField(key: string, value: any) {
		const field = fields.find(f => f.key === key);
		if (field) {
			field.value = value;
			// Trigger reactivity by reassigning the array
			fields = fields;
		}
	}
</script>

{#if isOpen}
	<div class="modal-overlay" on:click={handleClose} on:keydown={handleClose} role="button" tabindex="0">
		<div class="modal modal-{size}" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>{title}</h2>
				{#if showCloseButton}
					<button class="modal-close" on:click={handleClose}>×</button>
				{/if}
			</div>
			<div class="modal-body">
				{#if useCustomContent}
					<slot />
				{:else}
					<form on:submit|preventDefault={handleSubmit}>
						{#each sections as section}
							<div class="form-section">
								<h3>{section.title}</h3>
								<div class="form-row">
								{#each section.fields as fieldKey}
									{@const field = fields.find(f => f.key === fieldKey)}
									{#if field}
										<div class="form-group">
											<FormField
												label={field.label}
												type={field.type}
												value={field.value}
												placeholder={field.placeholder}
												required={field.required}
												options={field.options}
												rows={field.rows}
												showPasswordToggle={field.showPasswordToggle}
												on:change={(e) => updateField(field.key, e.detail.value)}
											/>
										</div>
									{/if}
								{/each}
								</div>
							</div>
						{/each}
						
						<div class="modal-actions">
							<button type="button" class="btn btn-secondary" on:click={handleClose} disabled={isLoading}>
								Cancel
							</button>
							<button type="submit" class="btn btn-primary" disabled={isLoading}>
								{#if isLoading}
									Saving...
								{:else}
									{submitText}
								{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
