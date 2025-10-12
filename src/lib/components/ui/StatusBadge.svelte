<script lang="ts">
	interface Props {
		status: string;
		type?: 'status' | 'role' | 'category' | 'payment' | 'custom';
		size?: 'sm' | 'md' | 'lg';
	}

	let { status, type = 'custom', size = 'md' }: Props = $props();

	function getBadgeClass(status: string, type: string): string {
		const baseClass = `badge badge-${size}`;
		
		// Status badges
		if (type === 'status') {
			const statusMap: Record<string, string> = {
				active: 'status-active',
				inactive: 'status-inactive',
				pending: 'status-pending',
				processing: 'status-processing',
				shipped: 'status-shipped',
				delivered: 'status-delivered',
				cancelled: 'status-cancelled',
				paid: 'status-paid',
				unpaid: 'status-unpaid'
			};
			return `${baseClass} ${statusMap[status] || 'status-default'}`;
		}
		
		// Role badges
		if (type === 'role') {
			const roleMap: Record<string, string> = {
				admin: 'role-admin',
				manager: 'role-manager',
				user: 'role-user'
			};
			return `${baseClass} ${roleMap[status] || 'role-default'}`;
		}
		
		// Category badges
		if (type === 'category') {
			return `${baseClass} category-${status}`;
		}
		
		// Payment badges
		if (type === 'payment') {
			return `${baseClass} payment-${status}`;
		}
		
		return baseClass;
	}

	function formatStatus(status: string): string {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}
</script>

<span class={getBadgeClass(status, type)} role="status" aria-label="{formatStatus(status)}">
	{formatStatus(status)}
</span>

<!-- All styles moved to app.css -->
