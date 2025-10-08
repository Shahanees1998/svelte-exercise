<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { usersStore, type User } from '$lib/stores/data';
	import { createSearchHandler } from '$lib/utils/debounce';
	import { validateUserForm } from '$lib/utils/formValidators';
	import { 
		USER_COLUMNS, 
		TABLE_ACTIONS, 
		EMPTY_MESSAGES, 
		SEARCH_PLACEHOLDERS,
		PAGE_HEADERS,
		MODAL_TITLES,
		BUTTON_LABELS,
		SUCCESS_MESSAGES
	} from '$lib/config/tableConfigs';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SearchFilter from '$lib/components/ui/SearchFilter.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';
	import UserFormModal from '$lib/components/users/UserFormModal.svelte';

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
	const userColumns = [...USER_COLUMNS];

	const tableActions = [
		{ 
			...TABLE_ACTIONS.edit, 
			onClick: (row: any) => {
				const user = users.find(u => u.id === row.id);
				if (user) openEditModal(user);
			}
		},
		{ 
			...TABLE_ACTIONS.delete, 
			onClick: (row: any) => {
				const user = users.find(u => u.id === row.id);
				if (user) openDeleteModal(user);
			}
		}
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
		const validation = validateUserForm({
			name: formData.name,
			email: formData.email,
			role: formData.role
		});

		if (!validation.valid) {
			toast.error(validation.error);
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
		toast.success(SUCCESS_MESSAGES.user.created);
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
		toast.success(SUCCESS_MESSAGES.user.updated);
	}

	function handleDeleteUser() {
		if (!selectedUser) return;

		usersStore.remove(selectedUser.id);
		closeModals();
		toast.success(SUCCESS_MESSAGES.user.deleted);
	}

</script>

<svelte:head>
	<title>Users - E-Commerce Dashboard</title>
</svelte:head>

<PageHeader
	title={PAGE_HEADERS.users.title}
	subtitle={PAGE_HEADERS.users.subtitle}
	buttonText={PAGE_HEADERS.users.buttonText}
	buttonIcon={PAGE_HEADERS.users.buttonIcon}
	onButtonClick={openAddModal}
/>

<SearchFilter
	searchPlaceholder={SEARCH_PLACEHOLDERS.users}
	bind:searchValue={searchTerm}
	{isSearching}
	on:search={(e) => { searchTerm = e.detail.value; handleSearch(); }}
/>

<DataTable
	columns={userColumns}
	data={mapUsersToRows(filteredUsers)}
	actions={tableActions}
	{isLoading}
	loadingMessage={EMPTY_MESSAGES.users.loading}
	emptyMessage={searchTerm ? EMPTY_MESSAGES.users.noResults : EMPTY_MESSAGES.users.noData}
	emptyIcon={EMPTY_MESSAGES.users.icon}
/>

<!-- Add User Modal -->
{#if showAddModal}
<UserFormModal
	bind:isOpen={showAddModal}
	title={MODAL_TITLES.user.add}
	submitText={BUTTON_LABELS.user.create}
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
	title={MODAL_TITLES.user.edit}
	submitText={BUTTON_LABELS.user.update}
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
	title={MODAL_TITLES.user.delete}
	itemName={selectedUser?.name || ''}
	itemType="user"
	on:close={closeModals}
	on:confirm={handleDeleteUser}
/>