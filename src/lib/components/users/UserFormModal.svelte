<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormModal from '../forms/FormModal.svelte';

	export let isOpen: boolean = false;
	export let title: string;
	export let submitText: string;
	export let name: string = '';
	export let email: string = '';
	export let role: string = 'user';
	export let status: 'active' | 'inactive' = 'active';
	export let idPrefix: string = 'user';

	const roles = ['user', 'admin', 'manager'];
	const statuses = ['active', 'inactive'];

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit() {
		dispatch('submit', {
			name,
			email,
			role,
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
		<!-- User Information Section -->
		<div class="form-section">
			<h3>User Information</h3>
			<div class="form-group">
				<label for="{idPrefix}-name">Name <span class="required">*</span></label>
				<input
					id="{idPrefix}-name"
					type="text"
					class="form-input"
					bind:value={name}
					placeholder="Enter user name"
					required
				/>
			</div>
			<div class="form-group">
				<label for="{idPrefix}-email">Email <span class="required">*</span></label>
				<input
					id="{idPrefix}-email"
					type="email"
					class="form-input"
					bind:value={email}
					placeholder="Enter email address"
					required
				/>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="{idPrefix}-role">Role</label>
					<select id="{idPrefix}-role" class="form-select" bind:value={role}>
						{#each roles as r}
							<option value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
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

