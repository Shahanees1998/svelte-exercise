<script lang="ts">
	import { enhance } from '$app/forms';
	import { UserRole, UserStatus, type User } from '$lib/types';

	interface Props {
		user?: User | null;
		onCancel: () => void;
		isEditing?: boolean;
		onSuccess?: (message?: string) => void;
		onError?: (error: string) => void;
	}

	let { user, onCancel, isEditing = false, onSuccess, onError }: Props = $props();
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
				const message = result.data?.message || (isEditing ? 'User updated successfully' : 'User created successfully');
				onSuccess?.(message);
			} else if (result.type === 'failure') {
				const error = result.data?.error || 'An error occurred';
				onError?.(error);
			}
		};
	}}
	class="user-form"
>
	{#if isEditing && user}
		<input type="hidden" name="id" value={user.id} />
	{/if}
	
	<div class="form-group">
		<label for={isEditing ? "edit-name" : "name"}>Full Name *</label>
		<input
			id={isEditing ? "edit-name" : "name"}
			name="name"
			type="text"
			class="form-input"
			value={user?.name || ''}
			required
			autocomplete="name"
		/>
	</div>
	
	<div class="form-group">
		<label for={isEditing ? "edit-email" : "email"}>Email Address *</label>
		<input
			id={isEditing ? "edit-email" : "email"}
			name="email"
			type="email"
			class="form-input"
			value={user?.email || ''}
			required
			autocomplete="email"
			disabled={isEditing}
			title={isEditing ? "Email cannot be changed after creation" : ""}
		/>
		{#if isEditing}
			<small class="form-help">Email cannot be changed after user creation</small>
		{/if}
	</div>
	
	<div class="form-row">
		<div class="form-group">
			<label for={isEditing ? "edit-role" : "role"}>Role *</label>
			<select
				id={isEditing ? "edit-role" : "role"}
				name="role"
				class="form-select"
				value={user?.role || UserRole.USER}
				required
			>
				<option value={UserRole.USER}>User</option>
				<option value={UserRole.MANAGER}>Manager</option>
				<option value={UserRole.ADMIN}>Admin</option>
			</select>
		</div>
		
		<div class="form-group">
			<label for={isEditing ? "edit-status" : "status"}>Status *</label>
			<select
				id={isEditing ? "edit-status" : "status"}
				name="status"
				class="form-select"
				value={user?.status || UserStatus.ACTIVE}
				required
			>
				<option value={UserStatus.ACTIVE}>Active</option>
				<option value={UserStatus.INACTIVE}>Inactive</option>
			</select>
		</div>
	</div>
	
	<div class="form-actions">
		<button type="button" class="btn btn-secondary" onclick={onCancel}>
			Cancel
		</button>
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update User' : 'Add User')}
		</button>
	</div>
</form>

<!-- All styles moved to app.css -->
