<script lang="ts">
	import { onMount } from 'svelte';
	import { usersStore, productsStore, ordersStore, type User, type Product, type Order } from '$lib/stores/data';
	import { formatPrice } from '$lib/utils/validation';

	let users: User[] = [];
	let products: Product[] = [];
	let orders: Order[] = [];
	let isLoading = true;

	// Statistics
	let totalUsers = 0;
	let totalProducts = 0;
	let totalOrders = 0;
	let totalRevenue = 0;
	let activeUsers = 0;
	let activeProducts = 0;
	let pendingOrders = 0;

	// Recent data
	let recentUsers: User[] = [];
	let recentProducts: Product[] = [];
	let recentOrders: Order[] = [];

	// Chart data
	let revenueData: { month: string; revenue: number }[] = [];
	let orderStatusData: { status: string; count: number }[] = [];

	onMount(() => {
		// Subscribe to all stores
		const unsubscribeUsers = usersStore.subscribe(value => {
			users = value;
			calculateStats();
		});

		const unsubscribeProducts = productsStore.subscribe(value => {
			products = value;
			calculateStats();
		});

		const unsubscribeOrders = ordersStore.subscribe(value => {
			orders = value;
			calculateStats();
		});

		// Simulate loading
		setTimeout(() => {
			isLoading = false;
		}, 1000);

		return () => {
			unsubscribeUsers();
			unsubscribeProducts();
			unsubscribeOrders();
		};
	});

	function calculateStats() {
		// Basic counts
		totalUsers = users.length;
		totalProducts = products.length;
		totalOrders = orders.length;

		// Active counts
		activeUsers = users.filter(u => u.status === 'active').length;
		activeProducts = products.filter(p => p.status === 'active').length;
		pendingOrders = orders.filter(o => o.status === 'pending').length;

		// Revenue calculation
		totalRevenue = orders
			.filter(o => o.paymentStatus === 'paid')
			.reduce((sum, order) => sum + order.totalAmount, 0);

		// Recent data (last 5 items)
		recentUsers = users
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5);

		recentProducts = products
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5);

		recentOrders = orders
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5);

		// Chart data
		generateRevenueData();
		generateOrderStatusData();
	}

	function generateRevenueData() {
		// Generate sample monthly revenue data
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
		revenueData = months.map(month => ({
			month,
			revenue: Math.floor(Math.random() * 50000) + 10000
		}));
	}

	function generateOrderStatusData() {
		const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
		orderStatusData = statuses.map(status => ({
			status: status.charAt(0).toUpperCase() + status.slice(1),
			count: orders.filter(o => o.status === status).length
		}));
	}

	// Stats card configuration
	$: statsCards = [
		{
			icon: '👥',
			iconClass: 'users',
			value: totalUsers,
			label: 'Total Users',
			format: (val: number) => val.toString()
		},
		{
			icon: '📦',
			iconClass: 'products',
			value: totalProducts,
			label: 'Total Products',
			format: (val: number) => val.toString()
		},
		{
			icon: '📋',
			iconClass: 'orders',
			value: totalOrders,
			label: 'Total Orders',
			format: (val: number) => val.toString()
		},
		{
			icon: '💰',
			iconClass: 'revenue',
			value: totalRevenue,
			label: 'Total Revenue',
			format: (val: number) => formatPrice(val)
		}
	];

	function getStatusClass(status: string) {
		switch (status.toLowerCase()) {
			case 'pending': return 'status-pending';
			case 'processing': return 'status-processing';
			case 'shipped': return 'status-shipped';
			case 'delivered': return 'status-delivered';
			case 'cancelled': return 'status-cancelled';
			default: return '';
		}
	}

	function getRoleClass(role: string) {
		switch (role) {
			case 'admin': return 'role-admin';
			case 'manager': return 'role-manager';
			default: return 'role-user';
		}
	}
</script>

<svelte:head>
	<title>Dashboard Overview - E-Commerce Dashboard</title>
</svelte:head>

{#if isLoading}
	<div class="loading-state">
		<div class="loading-spinner"></div>
		<p>Loading dashboard...</p>
	</div>
{:else}
	<!-- Statistics Cards -->
	<div class="stats-grid">
		{#each statsCards as stat}
			<div class="stat-card">
				<div class="stat-icon {stat.iconClass}">{stat.icon}</div>
				<div class="stat-content">
					<h3>{stat.format(stat.value)}</h3>
					<p>{stat.label}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Charts and Recent Data -->
	<div class="charts-section">
		<!-- Revenue Chart -->
		<div class="chart-card">
			<h3>Monthly Revenue</h3>
			<div class="chart-container">
				<div class="chart-bars">
					{#each revenueData as data}
						<div class="chart-bar">
							<div 
								class="bar" 
								class:bar-height-100={data.revenue === Math.max(...revenueData.map(d => d.revenue))}
								class:bar-height-80={data.revenue >= Math.max(...revenueData.map(d => d.revenue)) * 0.8}
								class:bar-height-60={data.revenue >= Math.max(...revenueData.map(d => d.revenue)) * 0.6}
								class:bar-height-40={data.revenue >= Math.max(...revenueData.map(d => d.revenue)) * 0.4}
								class:bar-height-20={data.revenue >= Math.max(...revenueData.map(d => d.revenue)) * 0.2}
							></div>
							<span class="bar-label">{data.month}</span>
							<span class="bar-value">{formatPrice(data.revenue)}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Order Status Chart -->
		<div class="chart-card">
			<h3>Order Status Distribution</h3>
			<div class="chart-container">
				<div class="pie-chart">
					{#each orderStatusData as data}
						<div class="pie-segment">
							<div class="pie-color {getStatusClass(data.status.toLowerCase())}"></div>
							<span class="pie-label">{data.status}: {data.count}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Data Tables -->
	<div class="recent-section">
		<!-- Recent Users -->
		<div class="recent-card">
			<h3>Recent Users</h3>
			<div class="recent-list">
				{#each recentUsers as user}
					<div class="recent-item">
						<div class="recent-avatar">
							{user.name.charAt(0).toUpperCase()}
						</div>
						<div class="recent-content">
							<h4>{user.name}</h4>
							<p>{user.email}</p>
						</div>
						<span class="recent-time">
							{new Date(user.createdAt).toLocaleDateString()}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Products -->
		<div class="recent-card">
			<h3>Recent Products</h3>
			<div class="recent-list">
				{#each recentProducts as product}
					<div class="recent-item">
						<div class="recent-avatar">
							📦
						</div>
						<div class="recent-content">
							<h4>{product.name}</h4>
							<p>{formatPrice(product.price)}</p>
						</div>
						<span class="recent-time">
							{new Date(product.createdAt).toLocaleDateString()}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}