<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { usersStore, productsStore, ordersStore, type User, type Product, type Order } from '$lib/stores/data';
	import { formatPrice } from '$lib/utils/validation';
	import { generateRevenueData } from '$lib/utils/chartHelpers';
	import { 
		calculateDashboardStats, 
		getRecentItems, 
		generateOrderStatusData,
		type DashboardStats
	} from '$lib/utils/dataProcessing';
	import StatCardEnhanced from '$lib/components/dashboard/StatCardEnhanced.svelte';
	import RevenueChart from '$lib/components/dashboard/RevenueChart.svelte';
	import OrderStatusChart from '$lib/components/dashboard/OrderStatusChart.svelte';
	import RecentItemsList from '$lib/components/dashboard/RecentItemsList.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import RefreshButton from '$lib/components/dashboard/RefreshButton.svelte';
	import EmptyState from '$lib/components/dashboard/EmptyState.svelte';

	// State management
	let users: User[] = [];
	let products: Product[] = [];
	let orders: Order[] = [];
	let isLoading = true;
	let isRefreshing = false;
	let error: string | null = null;
	let lastUpdated: Date | null = null;

	// Statistics
	let stats: DashboardStats = {
		totalUsers: 0,
		activeUsers: 0,
		totalProducts: 0,
		activeProducts: 0,
		totalOrders: 0,
		pendingOrders: 0,
		totalRevenue: 0,
		averageOrderValue: 0,
		revenueGrowth: 0
	};

	// Chart data
	let revenueData: { month: string; revenue: number }[] = [];
	let orderStatusData: { status: string; count: number; percentage: number }[] = [];

	// Recent data - using derived reactive statements
	$: recentUsers = getRecentItems(users, 5);
	$: recentProducts = getRecentItems(products, 5);

	// Check if dashboard has data
	$: hasData = users.length > 0 || products.length > 0 || orders.length > 0;

	// Stats cards configuration - enhanced with trends
	$: statsCards = [
		{
			icon: '👥',
			iconClass: 'users',
			value: stats.totalUsers.toString(),
			label: 'Total Users',
			subtitle: `${stats.activeUsers} active`,
			trend: stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 - 50 : 0
		},
		{
			icon: '📦',
			iconClass: 'products',
			value: stats.totalProducts.toString(),
			label: 'Total Products',
			subtitle: `${stats.activeProducts} in stock`,
			trend: stats.totalProducts > 0 ? (stats.activeProducts / stats.totalProducts) * 100 - 50 : 0
		},
		{
			icon: '📋',
			iconClass: 'orders',
			value: stats.totalOrders.toString(),
			label: 'Total Orders',
			subtitle: `${stats.pendingOrders} pending`,
			trend: stats.revenueGrowth
		},
		{
			icon: '💰',
			iconClass: 'revenue',
			value: formatPrice(stats.totalRevenue),
			label: 'Total Revenue',
			subtitle: `${formatPrice(stats.averageOrderValue)} avg. order`,
			trend: stats.revenueGrowth
		}
	];

	// Transform data for RecentItemsList components
	$: recentUsersData = recentUsers.map(user => ({
		id: user.id.toString(),
		primaryText: user.name,
		secondaryText: user.email,
		avatar: user.name.charAt(0).toUpperCase(),
		createdAt: user.createdAt
	}));

	$: recentProductsData = recentProducts.map(product => ({
		id: product.id.toString(),
		primaryText: product.name,
		secondaryText: formatPrice(product.price),
		avatar: '📦',
		createdAt: product.createdAt
	}));

	/**
	 * Initialize dashboard data
	 */
	onMount(() => {
		const unsubscribeUsers = usersStore.subscribe(value => {
			users = value;
			updateDashboard();
		});

		const unsubscribeProducts = productsStore.subscribe(value => {
			products = value;
			updateDashboard();
		});

		const unsubscribeOrders = ordersStore.subscribe(value => {
			orders = value;
			updateDashboard();
		});

		// Simulate loading with minimum time for UX
		const minLoadTime = setTimeout(() => {
			isLoading = false;
			lastUpdated = new Date();
		}, 800);

		return () => {
			unsubscribeUsers();
			unsubscribeProducts();
			unsubscribeOrders();
			clearTimeout(minLoadTime);
		};
	});

	/**
	 * Update all dashboard calculations
	 */
	function updateDashboard() {
		try {
			error = null;
			
			// Calculate statistics
			stats = calculateDashboardStats(users, products, orders);
			
			// Generate chart data
			revenueData = generateRevenueData();
			orderStatusData = generateOrderStatusData(orders);
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update dashboard';
			console.error('Dashboard update error:', err);
		}
	}

	/**
	 * Refresh dashboard data
	 */
	async function handleRefresh() {
		isRefreshing = true;
		
		// Simulate refresh delay for UX (in real app, this would be API calls)
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		updateDashboard();
		lastUpdated = new Date();
		isRefreshing = false;
	}
</script>

<svelte:head>
	<title>Dashboard Overview - E-Commerce Dashboard</title>
	<meta name="description" content="View your e-commerce dashboard statistics, revenue, orders, and recent activity" />
</svelte:head>

<div class="dashboard-overview">
	<!-- Header Section -->
	<div class="dashboard-header">
		<div class="header-content">
			<h1>Dashboard Overview</h1>
			<p class="header-subtitle">Monitor your business performance and key metrics</p>
		</div>
		<RefreshButton 
			{isRefreshing} 
			{lastUpdated}
			on:refresh={handleRefresh}
		/>
	</div>

	{#if isLoading}
		<div transition:fade={{ duration: 200 }}>
			<LoadingSpinner text="Loading dashboard..." />
		</div>
	{:else if error}
		<div class="error-container" transition:slide>
			<div class="error-content">
				<span class="error-icon">⚠️</span>
				<h3>Error Loading Dashboard</h3>
				<p>{error}</p>
				<button class="btn btn-primary" on:click={handleRefresh}>
					Try Again
				</button>
			</div>
		</div>
	{:else if !hasData}
		<div transition:fade>
			<EmptyState 
				icon="📊"
				title="Welcome to Your Dashboard"
				message="Your dashboard is empty. Start by adding users, products, or orders to see your statistics and analytics."
			/>
		</div>
	{:else}
		<div class="dashboard-content" transition:fade={{ duration: 300 }}>
			<!-- Statistics Cards -->
			<div class="stats-grid">
				{#each statsCards as stat, i}
					<div style="animation-delay: {i * 50}ms" class="fade-in-up">
						<StatCardEnhanced 
							icon={stat.icon}
							iconClass={stat.iconClass}
							value={stat.value}
							label={stat.label}
							subtitle={stat.subtitle}
							trend={stat.trend}
						/>
					</div>
				{/each}
			</div>

		<!-- Revenue Chart Section -->
		<div class="chart-full-width">
			<div class="fade-in-up" style="animation-delay: 200ms">
				<RevenueChart {revenueData} />
			</div>
		</div>

		<!-- Order Status and Recent Activity Section -->
		<div class="grid-two-columns">
			<div class="fade-in-up" style="animation-delay: 250ms">
				<OrderStatusChart {orderStatusData} />
			</div>
			<div class="fade-in-up" style="animation-delay: 300ms">
				<RecentItemsList title="Recent Users" items={recentUsersData} />
			</div>
		</div>

		<!-- Recent Activity Section -->
		<div class="grid-two-columns">
			<div class="fade-in-up" style="animation-delay: 350ms">
				<RecentItemsList title="Recent Products" items={recentProductsData} />
			</div>
		</div>
		</div>
	{/if}
</div>
