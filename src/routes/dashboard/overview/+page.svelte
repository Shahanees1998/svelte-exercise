<script lang="ts">
	import type { PageData } from './$types';
	import OverviewHeader from '$lib/components/dashboard/OverviewHeader.svelte';
	import StatsGrid from '$lib/components/dashboard/StatsGrid.svelte';
	import OrderStatusChart from '$lib/components/dashboard/OrderStatusChart.svelte';
	import RecentOrdersList from '$lib/components/dashboard/RecentOrdersList.svelte';
	import RecentUsersList from '$lib/components/dashboard/RecentUsersList.svelte';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Overview - Dashboard</title>
</svelte:head>

<OverviewHeader 
	title="Dashboard Overview"
	description="Welcome back! Here's what's happening with your business today."
/>

<StatsGrid stats={data.stats} />

<OrderStatusChart stats={data.stats} />

<section class="activity-grid" aria-label="Recent Activity">
	<RecentOrdersList orders={data.recentOrders} />
	<RecentUsersList users={data.recentUsers} />
</section>
