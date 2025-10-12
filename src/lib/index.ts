/**
 * Main library exports for reusable components and utilities
 */

// UI Components
export { default as PageHeader } from './components/ui/PageHeader.svelte';
export { default as SearchBar } from './components/ui/SearchBar.svelte';
export { default as DataTable } from './components/ui/DataTable.svelte';
export { default as ActionButtons } from './components/ui/ActionButtons.svelte';
export { default as StatusBadge } from './components/ui/StatusBadge.svelte';
export { default as StatCard } from './components/ui/StatCard.svelte';
export { default as Dialog } from './components/ui/Dialog.svelte';
export { default as ConfirmDialog } from './components/ui/ConfirmDialog.svelte';
export { default as EmptyState } from './components/ui/EmptyState.svelte';

// Form Components
export { default as UserForm } from './components/forms/UserForm.svelte';
export { default as ProductForm } from './components/forms/ProductForm.svelte';

// Dashboard Components
export { default as OverviewHeader } from './components/dashboard/OverviewHeader.svelte';
export { default as StatsGrid } from './components/dashboard/StatsGrid.svelte';
export { default as OrderStatusChart } from './components/dashboard/OrderStatusChart.svelte';
export { default as RecentOrdersList } from './components/dashboard/RecentOrdersList.svelte';
export { default as RecentUsersList } from './components/dashboard/RecentUsersList.svelte';

// Utilities
export * from './utils/formatters';
export * from './utils/tableConfigs';

// Stores
export { authStore } from './stores/auth.svelte';
export { toast } from './stores/toast.svelte';