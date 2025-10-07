<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { usersStore, type User } from '$lib/stores/data';
	import { validateEmail, validateRequired } from '$lib/utils/validation';
	import { createSearchHandler } from '$lib/utils/debounce';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchFilter from '$lib/components/SearchFilter.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import UserFormModal from '$lib/components/UserFormModal.svelte';

	let users: User[] = [];
	let filteredUsers: User[] = [];
	let searchTerm = '';
	let showAddModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let selectedUser: User | null = null;
	let isLoading = false;
	let isSearching = false;

	// Form data for add/edit
	let formData = {
		name: '',
		email: '',
		role: 'user',
		status: 'active' as 'active' | 'inactive'
	};

	// DataTable columns and actions
	const userColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' },
		{ key: 'status', label: 'Status' },
		{ key: 'createdAt', label: 'Created' }
	];

	const tableActions = [
		{ label: 'Edit', class: 'btn-secondary', onClick: (row: any) => {
			const user = users.find(u => u.id === row.id);
			if (user) openEditModal(user);
		}},
		{ label: 'Delete', class: 'btn-danger', onClick: (row: any) => {
			const user = users.find(u => u.id === row.id);
			if (user) openDeleteModal(user);
		}}
	];

	function mapUsersToRows(list: User[]) {
		return list.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: `<span class="role-badge role-${user.role}">${user.role}</span>`,
			status: `<span class="status-badge status-${user.status}">${user.status}</span>`,
			createdAt: user.createdAt
		}));
	}

	// Subscribe to store
	const unsubscribe = usersStore.subscribe(value => {
		users = value;
		filterUsers();
	});

	onMount(() => {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 300);

		return () => {
			unsubscribe();
		};
	});

	function filterUsers() {
		if (!searchTerm.trim()) {
			filteredUsers = [...users];
		} else {
			filteredUsers = users.filter(user =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		isSearching = false;
	}

	// Debounced search handler
	const debouncedSearch = createSearchHandler(() => {
		filterUsers();
	}, 500);

	function handleSearch() {
		isSearching = true;
		debouncedSearch();
	}

	function openAddModal() {
		formData = { name: '', email: '', role: 'user', status: 'active' };
		showAddModal = true;
	}

	function openEditModal(user: User) {
		selectedUser = user;
		formData = { name: user.name, email: user.email, role: user.role, status: user.status };
		showEditModal = true;
	}

	function openDeleteModal(user: User) {
		selectedUser = user;
		showDeleteModal = true;
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		showDeleteModal = false;
		selectedUser = null;
	}

	function validateForm(): boolean {
		const nameValidation = validateRequired(formData.name, 'Name');
		if (!nameValidation.valid) {
			toast.error(nameValidation.error);
			return false;
		}

		const emailValidation = validateRequired(formData.email, 'Email');
		if (!emailValidation.valid) {
			toast.error(emailValidation.error);
			return false;
		}

		if (!validateEmail(formData.email)) {
			toast.error('Please enter a valid email address');
			return false;
		}

		return true;
	}

	function handleAddUser() {
		if (!validateForm()) return;

		const userData = {
			name: formData.name,
			email: formData.email,
			role: formData.role,
			status: formData.status
		};

		usersStore.add(userData);
		closeModals();
		toast.success('User created successfully!');
	}

	function handleEditUser() {
		if (!validateForm() || !selectedUser) return;

		const updates = {
			name: formData.name,
			email: formData.email,
			role: formData.role,
			status: formData.status
		};

		usersStore.update(selectedUser.id, updates);
		closeModals();
		toast.success('User updated successfully!');
	}

	function handleDeleteUser() {
		if (!selectedUser) return;

		usersStore.remove(selectedUser.id);
		closeModals();
		toast.success('User deleted successfully!');
	}

</script>

<svelte:head>
	<title>Users - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title="Users"
	subtitle="Manage user accounts and permissions"
	buttonText="Add User"
	buttonIcon="+"
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder="Search users by name or email..."
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={userColumns}
	data={mapUsersToRows(filteredUsers)}
	actions={tableActions}
	{isLoading}
	loadingMessage="Loading users..."
	emptyMessage={searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first user'}
	emptyIcon="👥"
/>

<!-- Add User Modal -->
{#if showAddModal}
<UserFormModal
	bind:isOpen={showAddModal}
	title="Create New User"
	submitText="Create User"
	bind:name={formData.name}
	bind:email={formData.email}
	bind:role={formData.role}
	bind:status={formData.status}
	idPrefix="add"
	on:close={closeModals}
	on:submit={handleAddUser}
/>
{/if}

<!-- Edit User Modal -->
{#if showEditModal && selectedUser}
{#key selectedUser.id}
<UserFormModal
	bind:isOpen={showEditModal}
	title="Edit User"
	submitText="Update User"
	bind:name={formData.name}
	bind:email={formData.email}
	bind:role={formData.role}
	bind:status={formData.status}
	idPrefix="edit"
	on:close={closeModals}
	on:submit={handleEditUser}
/>
{/key}
{/if}

<!-- Delete User Modal -->
<DeleteModal
	bind:isOpen={showDeleteModal}
	title="Delete User"
	itemName={selectedUser?.name || ''}
	itemType="user"
	on:close={closeModals}
	on:confirm={handleDeleteUser}
/>