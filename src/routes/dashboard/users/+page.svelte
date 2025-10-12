<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { User } from '$lib/server/data';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	
	let { data }: { data: PageData } = $props();
	
	let showAddDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedUser = $state<User | null>(null);
	
	// Form state
	let formName = $state('');
	let formEmail = $state('');
	let formRole = $state('user');
	let formStatus = $state<'active' | 'inactive'>('active');
	
	function handleSearch(e: Event) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;
		
		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function clearSearch() {
		const url = new URL($page.url);
		url.searchParams.delete('search');
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function openAddDialog() {
		formName = '';
		formEmail = '';
		formRole = 'user';
		formStatus = 'active';
		showAddDialog = true;
	}
	
	function openEditDialog(user: User) {
		selectedUser = user;
		formName = user.name;
		formEmail = user.email;
		formRole = user.role;
		formStatus = user.status;
		showEditDialog = true;
	}
	
	function openDeleteDialog(user: User) {
		selectedUser = user;
		showDeleteDialog = true;
	}
	
	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	function handleAddUser() {
		if (!formName || !formEmail) {
			toast.error('Please fill in all required fields');
			return;
		}
		
		if (!validateEmail(formEmail)) {
			toast.error('Please enter a valid email address');
			return;
		}
		
		// In a real app, this would call an API endpoint
		// For now, just show success and refresh
		showAddDialog = false;
		toast.success('User added successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function handleEditUser() {
		if (!selectedUser || !formName || !formEmail) {
			toast.error('Please fill in all required fields');
			return;
		}
		
		if (!validateEmail(formEmail)) {
			toast.error('Please enter a valid email address');
			return;
		}
		
		// In a real app, this would call an API endpoint
		// For now, just show success and refresh
		showEditDialog = false;
		toast.success('User updated successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function handleDeleteUser() {
		if (!selectedUser) return;
		
		// In a real app, this would call an API endpoint
		// For now, just show success and refresh
		showDeleteDialog = false;
		toast.success('User deleted successfully');
		goto($page.url.toString(), { invalidateAll: true });
	}
	
	function getRoleBadgeClass(role: string): string {
		const classes: Record<string, string> = {
			admin: 'badge-admin',
			manager: 'badge-manager',
			user: 'badge-user'
		};
		return classes[role] || 'badge-user';
	}
</script>

<svelte:head>
	<title>Users - Dashboard</title>
</svelte:head>

<header class="page-header">
	<div>
		<h1>Users</h1>
		<p>Manage user accounts and permissions</p>
	</div>
	<button class="btn btn-primary" onclick={openAddDialog}>
		+ Add User
	</button>
</header>

<!-- Search Form -->
<form class="search-section" onsubmit={handleSearch}>
	<div class="search-container">
		<input
			type="search"
			name="search"
			class="form-input"
			placeholder="Search users..."
			value={data.search}
		/>
		<button type="submit" class="btn btn-primary btn-sm">
			🔍 Search
		</button>
		{#if data.search}
			<button type="button" class="btn btn-secondary btn-sm" onclick={clearSearch}>
				Clear
			</button>
		{/if}
	</div>
</form>

<!-- Users Table -->
<section class="card">
	{#if data.users.length === 0}
		<div class="empty-state">
			<div class="empty-icon">👥</div>
			<h3>No users found</h3>
			<p>{data.search ? 'Try a different search term' : 'Add your first user to get started'}</p>
		</div>
	{:else}
		<div class="table-container">
			<table class="data-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Status</th>
						<th>Created</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as user (user.id)}
						<tr>
							<td>{user.id}</td>
							<td><strong>{user.name}</strong></td>
							<td>{user.email}</td>
							<td><span class="badge {getRoleBadgeClass(user.role)}">{user.role}</span></td>
							<td><span class="badge status-{user.status}">{user.status}</span></td>
							<td>{user.createdAt}</td>
							<td>
								<div class="flex gap-sm">
									<button 
										class="btn btn-sm btn-secondary" 
										onclick={() => openEditDialog(user)}
										aria-label="Edit {user.name}"
									>
										✏️ Edit
									</button>
									<button 
										class="btn btn-sm btn-danger" 
										onclick={() => openDeleteDialog(user)}
										aria-label="Delete {user.name}"
									>
										🗑️ Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<!-- Add User Dialog -->
<Dialog bind:open={showAddDialog} title="Add New User">
	{#snippet children()}
		<form onsubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
			<div class="form-group">
				<label for="add-name">Full Name *</label>
				<input
					id="add-name"
					type="text"
					class="form-input"
					bind:value={formName}
					required
					autocomplete="name"
				/>
			</div>
			
			<div class="form-group">
				<label for="add-email">Email Address *</label>
				<input
					id="add-email"
					type="email"
					class="form-input"
					bind:value={formEmail}
					required
					autocomplete="email"
				/>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="add-role">Role *</label>
					<select
						id="add-role"
						class="form-select"
						bind:value={formRole}
						required
					>
						<option value="user">User</option>
						<option value="manager">Manager</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="add-status">Status *</label>
					<select
						id="add-status"
						class="form-select"
						bind:value={formStatus}
						required
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			
			<div class="dialog-footer">
				<button type="button" class="btn btn-secondary" onclick={() => showAddDialog = false}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary">
					Add User
				</button>
			</div>
		</form>
	{/snippet}
</Dialog>

<!-- Edit User Dialog -->
<Dialog bind:open={showEditDialog} title="Edit User">
	{#snippet children()}
		<form onsubmit={(e) => { e.preventDefault(); handleEditUser(); }}>
			<div class="form-group">
				<label for="edit-name">Full Name *</label>
				<input
					id="edit-name"
					type="text"
					class="form-input"
					bind:value={formName}
					required
					autocomplete="name"
				/>
			</div>
			
			<div class="form-group">
				<label for="edit-email">Email Address *</label>
				<input
					id="edit-email"
					type="email"
					class="form-input"
					bind:value={formEmail}
					required
					autocomplete="email"
				/>
			</div>
			
			<div class="flex gap-md">
				<div class="form-group" style="flex: 1;">
					<label for="edit-role">Role *</label>
					<select
						id="edit-role"
						class="form-select"
						bind:value={formRole}
						required
					>
						<option value="user">User</option>
						<option value="manager">Manager</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				
				<div class="form-group" style="flex: 1;">
					<label for="edit-status">Status *</label>
					<select
						id="edit-status"
						class="form-select"
						bind:value={formStatus}
						required
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			
			<div class="dialog-footer">
				<button type="button" class="btn btn-secondary" onclick={() => showEditDialog = false}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary">
					Update User
				</button>
			</div>
		</form>
	{/snippet}
</Dialog>

<!-- Delete User Dialog -->
<Dialog bind:open={showDeleteDialog} title="Delete User">
	{#snippet children()}
		<p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
		<p>This action cannot be undone.</p>
		
		<div class="dialog-footer">
			<button class="btn btn-secondary" onclick={() => showDeleteDialog = false}>
				Cancel
			</button>
			<button class="btn btn-danger" onclick={handleDeleteUser}>
				Delete User
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
		gap: var(--space-md);
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
	
	.search-container {
		display: flex;
		gap: var(--space-sm);
		max-width: 600px;
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
	
	.badge-admin {
		background-color: #e3f2fd;
		color: #1565c0;
	}
	
	.badge-manager {
		background-color: #f3e5f5;
		color: #6a1b9a;
	}
	
	.badge-user {
		background-color: #e8f5e9;
		color: #2e7d32;
	}
	
	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
		}
		
		.page-header button {
			width: 100%;
		}
		
		.search-container {
			flex-wrap: wrap;
			max-width: none;
		}
		
		.search-container input {
			flex: 1 1 100%;
		}
	}
</style>
