<script lang="ts">
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { formatPrice } from '$lib/utils/formatters';

	interface Stats {
		totalUsers: number;
		activeUsers: number;
		totalProducts: number;
		activeProducts: number;
		totalOrders: number;
		pendingOrders: number;
		totalRevenue: number;
	}

	interface Props {
		stats: Stats;
	}

	let { stats }: Props = $props();
</script>

<section class="stats-grid" aria-label="Key Statistics">
	<StatCard 
		icon="👥"
		title="Total Users"
		value={stats.totalUsers}
		subtitle="{stats.activeUsers} active"
		color="primary"
	/>
	
	<StatCard 
		icon="📦"
		title="Total Products"
		value={stats.totalProducts}
		subtitle="{stats.activeProducts} active"
		color="secondary"
	/>
	
	<StatCard 
		icon="🛒"
		title="Total Orders"
		value={stats.totalOrders}
		subtitle="{stats.pendingOrders} pending"
		color="info"
	/>
	
	<StatCard 
		icon="💰"
		title="Total Revenue"
		value={formatPrice(stats.totalRevenue)}
		subtitle="All time"
		color="success"
	/>
</section>
