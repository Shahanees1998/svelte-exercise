<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { User } from '$lib/types';
	import { toast } from '$lib/stores/toast.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ActionButtons from '$lib/components/ui/ActionButtons.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import UserForm from '$lib/components/forms/UserForm.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { userColumns } from '$lib/utils/tableConfigs';
	
	let { data }: { data: PageData } = $props();
	
	let showAddDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedUser = $state<User | null>(null);
	
	function handleFormSuccess(message?: string) {
		showAddDialog = false;
		showEditDialog = false;
		showDeleteDialog = false;
		selectedUser = null;
		toast.success(message || 'Operation successful');
	}
	
	function handleFormError(error: string) {
		toast.error(error);
	}
	
	function handleSearch(search: string) {
		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
	
	function clearSearch() {
		goto('/dashboard/users', { keepFocus: true, noScroll: true });
	}
	
	function openAddDialog() {
		selectedUser = null;
		showAddDialog = true;
	}
	
	function openEditDialog(user: User) {
		selectedUser = user;
		showEditDialog = true;
	}
	
	function openDeleteDialog(user: User) {
		selectedUser = user;
		showDeleteDialog = true;
	}
</script>

<svelte:head>
	<title>Users - Dashboard</title>
</svelte:head>

<PageHeader 
	title="Users" 
	description="Manage user accounts and permissions"
	actionButton={{
		label: "+ Add User",
		onclick: openAddDialog
	}}
/>

<SearchBar 
	searchValue={data.search}
	placeholder="Search users..."
	onSearch={handleSearch}
	onClear={clearSearch}
/>

<DataTable 
	columns={userColumns}
	data={data.users}
	keyField="id"
	emptyMessage="No users found"
	emptyIcon="👥"
	emptyDescription={data.search ? 'Try a different search term' : 'Add your first user to get started'}
>
	{#snippet rowSnippet(user)}
		<tr>
			<td>{user.id}</td>
			<td><strong>{user.name}</strong></td>
			<td>{user.email}</td>
			<td><StatusBadge status={user.role} type="role" /></td>
			<td><StatusBadge status={user.status} type="status" /></td>
			<td>{user.createdAt}</td>
			<td>
				<ActionButtons 
					actions={[
						{
							label: "Edit",
							icon: "✏️",
							variant: "secondary",
							onclick: () => openEditDialog(user),
							'aria-label': `Edit ${user.name}`
						},
						{
							label: "Delete",
							icon: "🗑️",
							variant: "danger",
							onclick: () => openDeleteDialog(user),
							'aria-label': `Delete ${user.name}`
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

{#if data.pagination.totalPages > 1}
	<Pagination 
		currentPage={data.pagination.currentPage}
		totalPages={data.pagination.totalPages}
		totalItems={data.pagination.totalItems}
		itemsPerPage={data.pagination.itemsPerPage}
		itemName="users"
	/>
{/if}

<Dialog bind:open={showAddDialog} title="Add New User">
	{#snippet children()}
		<UserForm 
			user={null}
			onCancel={() => showAddDialog = false}
			isEditing={false}
			onSuccess={handleFormSuccess}
			onError={handleFormError}
		/>
	{/snippet}
</Dialog>

<Dialog bind:open={showEditDialog} title="Edit User">
	{#snippet children()}
		<UserForm 
			user={selectedUser}
			onCancel={() => showEditDialog = false}
			isEditing={true}
			onSuccess={handleFormSuccess}
			onError={handleFormError}
		/>
	{/snippet}
</Dialog>

<ConfirmDialog 
	bind:open={showDeleteDialog}
	title="Delete User"
	message="Are you sure you want to delete this user?"
	itemName={selectedUser?.name}
	itemId={selectedUser?.id}
	action="?/delete"
	confirmLabel="Delete User"
	onCancel={() => showDeleteDialog = false}
	onSuccess={handleFormSuccess}
	onError={handleFormError}
/>
