<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	function formatPrice(price: number) {
		return `$${price.toFixed(2)}`;
	}
	
	function getInitials(name: string) {
		return name.split(' ').map(n => n[0]).join('').toUpperCase();
	}
</script>

<svelte:head>
	<title>Overview - Dashboard</title>
</svelte:head>

<header class="overview-header">
	<h1>Dashboard Overview</h1>
	<p>Welcome back! Here's what's happening with your business today.</p>
</header>

<!-- Stats Grid -->
<section class="stats-grid" aria-label="Key Statistics">
	<article class="stat-card">
		<div class="stat-icon users" aria-hidden="true">👥</div>
		<div class="stat-content">
			<h3>Total Users</h3>
			<div class="stat-value">{data.stats.totalUsers}</div>
			<p class="stat-subtitle">{data.stats.activeUsers} active</p>
		</div>
	</article>
	
	<article class="stat-card">
		<div class="stat-icon products" aria-hidden="true">📦</div>
		<div class="stat-content">
			<h3>Total Products</h3>
			<div class="stat-value">{data.stats.totalProducts}</div>
			<p class="stat-subtitle">{data.stats.activeProducts} active</p>
		</div>
	</article>
	
	<article class="stat-card">
		<div class="stat-icon orders" aria-hidden="true">🛒</div>
		<div class="stat-content">
			<h3>Total Orders</h3>
			<div class="stat-value">{data.stats.totalOrders}</div>
			<p class="stat-subtitle">{data.stats.pendingOrders} pending</p>
		</div>
	</article>
	
	<article class="stat-card">
		<div class="stat-icon revenue" aria-hidden="true">💰</div>
		<div class="stat-content">
			<h3>Total Revenue</h3>
			<div class="stat-value">{formatPrice(data.stats.totalRevenue)}</div>
			<p class="stat-subtitle">All time</p>
		</div>
	</article>
</section>

<!-- Order Status Chart -->
<section class="card" aria-labelledby="order-status-heading">
	<h2 id="order-status-heading">Order Status Distribution</h2>
	<div class="status-grid">
		<div class="status-item">
			<div class="status-label status-pending">⏳ Pending</div>
			<div class="status-value">{data.stats.pendingOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-pending" 
					style="width: {data.stats.totalOrders ? (data.stats.pendingOrders / data.stats.totalOrders * 100) : 0}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-processing">🔄 Processing</div>
			<div class="status-value">{data.stats.processingOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-processing" 
					style="width: {data.stats.totalOrders ? (data.stats.processingOrders / data.stats.totalOrders * 100) : 0}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-shipped">📦 Shipped</div>
			<div class="status-value">{data.stats.shippedOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-shipped" 
					style="width: {data.stats.totalOrders ? (data.stats.shippedOrders / data.stats.totalOrders * 100) : 0}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-delivered">✅ Delivered</div>
			<div class="status-value">{data.stats.deliveredOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-delivered" 
					style="width: {data.stats.totalOrders ? (data.stats.deliveredOrders / data.stats.totalOrders * 100) : 0}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-cancelled">❌ Cancelled</div>
			<div class="status-value">{data.stats.cancelledOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-cancelled" 
					style="width: {data.stats.totalOrders ? (data.stats.cancelledOrders / data.stats.totalOrders * 100) : 0}%"
				></div>
			</div>
		</div>
	</div>
</section>

<!-- Recent Activity -->
<section class="activity-grid" aria-label="Recent Activity">
	<article class="card">
		<h2>Recent Orders</h2>
		{#if data.recentOrders.length === 0}
			<p class="empty-text">No recent orders</p>
		{:else}
			<ul class="activity-list">
				{#each data.recentOrders as order}
					<li class="activity-item">
						<div class="activity-icon" aria-hidden="true">🛒</div>
						<div class="activity-content">
							<div class="activity-title">{order.orderNumber}</div>
							<div class="activity-subtitle">{order.customerName} • {formatPrice(order.totalAmount)}</div>
						</div>
						<span class="badge status-{order.status}">{order.status}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</article>
	
	<article class="card">
		<h2>Recent Users</h2>
		{#if data.recentUsers.length === 0}
			<p class="empty-text">No recent users</p>
		{:else}
			<ul class="activity-list">
				{#each data.recentUsers as user}
					<li class="activity-item">
						<div class="user-avatar-small">
							{getInitials(user.name)}
						</div>
						<div class="activity-content">
							<div class="activity-title">{user.name}</div>
							<div class="activity-subtitle">{user.email}</div>
						</div>
						<span class="badge status-{user.status}">{user.status}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</article>
</section>

<style>
	.overview-header {
		margin-bottom: var(--space-2xl);
	}
	
	.overview-header h1 {
		margin-bottom: var(--space-xs);
	}
	
	.overview-header p {
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-xl);
		margin-bottom: var(--space-2xl);
	}
	
	.stat-card {
		background: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		box-shadow: var(--shadow-md);
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}
	
	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}
	
	.stat-icon {
		width: 60px;
		height: 60px;
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		flex-shrink: 0;
	}
	
	.stat-icon.users {
		background: var(--gradient-primary);
	}
	
	.stat-icon.products {
		background: var(--gradient-danger);
	}
	
	.stat-icon.orders {
		background: var(--gradient-info);
	}
	
	.stat-icon.revenue {
		background: var(--gradient-success);
	}
	
	.stat-content h3 {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-xs);
	}
	
	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text-primary);
		line-height: 1;
	}
	
	.stat-subtitle {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: var(--space-xs) 0 0 0;
	}
	
	.card {
		background: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		box-shadow: var(--shadow-md);
		margin-bottom: var(--space-xl);
	}
	
	.card h2 {
		margin-bottom: var(--space-lg);
		font-size: var(--font-size-xl);
	}
	
	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-lg);
	}
	
	.status-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.status-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		display: inline-block;
		width: fit-content;
	}
	
	.status-value {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
	}
	
	.status-bar {
		height: 8px;
		background-color: var(--color-gray-200);
		border-radius: var(--radius-full);
		overflow: hidden;
	}
	
	.status-fill {
		height: 100%;
		border-radius: var(--radius-full);
		transition: width 500ms ease;
	}
	
	.status-fill.status-pending {
		background-color: #fbbf24;
	}
	
	.status-fill.status-processing {
		background-color: #3b82f6;
	}
	
	.status-fill.status-shipped {
		background-color: #06b6d4;
	}
	
	.status-fill.status-delivered {
		background-color: #10b981;
	}
	
	.status-fill.status-cancelled {
		background-color: #ef4444;
	}
	
	.activity-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-xl);
	}
	
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
		transition: background-color var(--transition-base);
	}
	
	.activity-item:hover {
		background-color: var(--color-bg-tertiary);
	}
	
	.activity-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gradient-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		flex-shrink: 0;
	}
	
	.user-avatar-small {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gradient-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: var(--font-size-sm);
		flex-shrink: 0;
	}
	
	.activity-content {
		flex: 1;
		min-width: 0;
	}
	
	.activity-title {
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xs);
	}
	
	.activity-subtitle {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
	
	.empty-text {
		text-align: center;
		color: var(--color-text-secondary);
		padding: var(--space-xl);
	}
	
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
		
		.status-grid {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
		
		.activity-grid {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
	}
</style>
